import requests
import pandas as pd
import json


def get_random_10Q(cik):
    """
    Get a random 10-Q filing from the SEC EDGAR database.

    Returns:
        dict: A dictionary containing the company name, CIK, and MD&A section of the filing.
    """
    headers = {"User-Agent": "email@address.com"}
    # get company specific filing metadata
    filing_metadata = requests.get(
        f"https://data.sec.gov/submissions/CIK{cik}.json", headers=headers
    )

    allForms = pd.DataFrame.from_dict(filing_metadata.json()["filings"]["recent"])
    ten_q = allForms[allForms["form"].str.contains("10-Q")]

    ten_q = ten_q[["accessionNumber", "reportDate", "form"]]
    # get 10 recent 10-Q filings
    ten_q = ten_q.head(10)
    # take a random one
    random_10Q = ten_q.sample()
    random_10Q = random_10Q.to_dict()

    return {
        "accessionNumber": list(random_10Q["accessionNumber"].values())[0],
        "reportDate": list(random_10Q["reportDate"].values())[0],
    }


def get_random_cik():
    """
    Get a random CIK number from the SEC EDGAR database.

    Returns:
        str: A random CIK number.
    """
    # read json using file
    with open("./backend/resources/data.json") as f:
        data = json.load(f)

    # print(data)
    # get random cik from the json
    return str(data["1"]["cik_str"]).zfill(10)


def txt_url_builder(cik, accessionNumber):
    """
    Build the URL for the text file containing the MD&A section of a 10-Q filing.

    Parameters:
        cik (str): The CIK number of the company.
        accessionNumber (str): The accession number of the filing.

    Returns:
        str: The URL of the text file.
    """
    non_leading_zeros_cik = cik[-6:]
    return f"https://www.sec.gov/Archives/edgar/data/{non_leading_zeros_cik}/{accessionNumber}.txt"


def full_filing_url_builder(cik, accessionNumber):
    """
    Build the URL for the full 10-Q filing.

    Parameters:
        cik (str): The CIK number of the company.
        accessionNumber (str): The accession number of the filing.

    Returns:
        str: The URL of the full filing.
    """
    non_leading_zeros_cik = cik[-6:]
    accessionNumber_no_dashes = accessionNumber.replace("-", "")
    #
    return f"https://www.sec.gov/Archives/edgar/data/{cik}/{accessionNumber_no_dashes}/{accessionNumber}-index.html"


# if __name__ == "__main__":
#     random_cik = get_random_cik()
#     print(random_cik)

#     random_10Q = get_random_10Q(random_cik)
#     print(random_10Q)

#     print(txt_url_builder(random_cik, random_10Q["accessionNumber"]))
#     print(full_filing_url_builder(random_cik, random_10Q["accessionNumber"]))
