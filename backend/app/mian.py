from flask import Flask, jsonify, request
from flask_cors import CORS

from .sec_reader import CompanyRetriever, SECRetriever

app = Flask(__name__)
CORS(app)
secRetriever = SECRetriever()


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "Server is running"})


@app.route("/api/challenge", methods=["GET"])
def get_challenge():

    # Get a random CIK number
    random_cik = CompanyRetriever.get_random_cik()
    # Get a random 10-Q filing for the company
    random_10Q = CompanyRetriever.get_random_10Q(random_cik)

    txt_url = CompanyRetriever.txt_url_builder(
        random_cik, random_10Q["accessionNumber"]
    )
    full_filing_url = CompanyRetriever.full_filing_url_builder(
        random_cik, random_10Q["accessionNumber"]
    )

    # Extract the MD&A section from the 10-Q filing
    mdna_section = secRetriever.extract_mdna(txt_url)
    print(mdna_section)

    # LLM Results for the MD&A section

    return jsonify(new_user), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
