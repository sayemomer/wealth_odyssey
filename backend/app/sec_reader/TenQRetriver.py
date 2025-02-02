import requests
import pandas as pd
import re
import json
from typing import Dict, Optional, Any
import time
from datetime import datetime
from sec_parsers import download_sec_filing
from sec_parsers import Filing
import sec_parser as sp
import re
from bs4 import BeautifulSoup


class SECRetriever:
    def __init__(self, user_agent: str):
        """
        Initialize the SEC retriever with necessary headers.

        Args:
            user_agent (str): Your company/personal email for SEC EDGAR access
        """
        self.headers = {
            "User-Agent": user_agent,
            "Accept-Encoding": "gzip, deflate",
            "Host": "data.sec.gov",
        }
        self.base_url = "https://data.sec.gov"

    def _format_cik(self, cik: str) -> str:
        """Format CIK to 10 digits with leading zeros."""
        return cik.zfill(10)

    def _pars_until_mnda(self, elements):
        children = []
        for part in sp.TreeBuilder().build(elements):
            for item in part.children:
                children.append(item)

        if (
            len(
                [k for k in children if "management" in k.semantic_element.text.lower()]
            )
            == 1
        ):
            return children

        for lvl in range(5):
            child_tmp = []
            for child in children:
                child_tmp.append(child)

            if (
                len(
                    [
                        k
                        for k in child_tmp
                        if "management" in k.semantic_element.text.lower()
                    ]
                )
                >= 1
            ):
                break

            children = child_tmp

        return [k for k in children if "management" in k.semantic_element.text.lower()]

    def extract_mdna(self, filing_url):
        # Parse the HTML content
        html_content = download_sec_filing(filing_url)
        soup = BeautifulSoup(html_content, "html.parser")
        text = soup.get_text(separator=" ")

        # Regex pattern to capture text between MD&A start and end markers.
        # This example assumes "Item 7" is the start and "Item 7A" or "Item 8" marks the end.
        pattern = re.compile(
            r"(Item\s+7\.?\s+(\s+Discussion\s+and\s+Analysis))(.*?)(Item\s+7A|Item\s+8)",
            re.IGNORECASE | re.DOTALL,
        )
        match = pattern.search(text)
        if match:
            # Group 3 typically holds the content between the headings.
            mdna_text = match.group(3)
            return mdna_text.strip()
        else:
            return None

    # Example usage:
    # with open('sample_filing.html', 'r') as f:
    # html_content = f.read()
    # mdna_section = extract_mdna(html_content)
    # print(mdna_section)

    def extract_mdna_section(self, filing_url):
        """
        Downloads an SEC filing, extracts the MD&A section, and returns it as a plain text string.
        """
        # Download HTML
        html = download_sec_filing(filing_url)

        # Parse HTML
        elements = sp.Edgar10QParser().parse(html)
        top_level_sections = []
        for part in sp.TreeBuilder().build(elements):
            for item in part.children:
                top_level_sections.append(item)

        # Filter MD&A section
        mdna_top_level_sections = [
            k
            for k in top_level_sections
            if "management" in k.semantic_element.text.lower()
        ]

        # if len(mdna_top_level_sections) == 0:
        #     top_level_sections = []
        #     elements = sp.Edgar10QParser().parse(html)
        #     top_level_sections = []
        #     for part in sp.TreeBuilder().build(elements):
        #         for item in part.children:
        #             for child in item.children:
        #                 top_level_sections.append(child)

        #     # Filter MD&A section
        #     mdna_top_level_sections = [
        #         k
        #         for k in top_level_sections
        #         if "management" in k.semantic_element.text.lower()
        #     ]
        # mdna_top_level_sections = self._pars_until_mnda(elements)

        assert len(mdna_top_level_sections) == 1, "MD&A sections detected: {}".format(
            len(mdna_top_level_sections)
        )
        mdna_top_level_section = mdna_top_level_sections[0]

        # Extract text
        text = mdna_top_level_section.semantic_element.text + "\n"
        for node in mdna_top_level_section.get_descendants():
            element = node.semantic_element
            if isinstance(element, sp.TextElement):
                text += f"{element.text}\n"
            elif isinstance(element, sp.TitleElement):
                text += f"{element.text}\n"
            elif isinstance(element, sp.TableElement):
                text += f"[{element.text}]\n"

        return text


# Example usage:
# filing_url = "https://www.sec.gov/Archives/edgar/data/320193/0000320193-25-000008.txt"
# mdna_text = extract_mdna_section(filing_url)
# print(mdna_text)
