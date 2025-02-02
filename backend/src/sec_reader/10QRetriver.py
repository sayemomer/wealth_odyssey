import requests
import pandas as pd
import re
import json
from typing import Dict, Optional, Any
import time
from datetime import datetime
from sec_parsers import download_sec_filing
from sec_parsers import Filing
import sec_parsers as sp


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

    def extract_mdna_section(filing_url):
        """
        Downloads an SEC filing, extracts the MD&A section, and returns it as a plain text string.
        """
        # Download HTML
        html = download_sec_filing(filing_url)

        # Parse HTML
        elements = sp.Edgar10QParser().parse(html)
        top_level_sections = [
            item for part in sp.TreeBuilder().build(elements) for item in part.children
        ]

        # Filter MD&A section
        mdna_top_level_sections = [
            k
            for k in top_level_sections
            if "management" in k.semantic_element.text.lower()
        ]
        assert (
            len(mdna_top_level_sections) == 1
        ), "MD&A section not found or multiple sections detected"
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
