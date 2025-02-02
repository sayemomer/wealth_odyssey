import yfinance as yf
import pandas as pd


class StockFetcher:

    def fetch_stock_data(ticker, start_date, end_date):
        """
        Fetches historical stock data for a given ticker symbol between specified start and end dates.

        Parameters:
        ticker (str): The stock ticker symbol (e.g., 'AAPL' for Apple).
        start_date (str): The start date in 'YYYY-MM-DD' format.
        end_date (str): The end date in 'YYYY-MM-DD' format.

        Returns:
        pd.DataFrame: A DataFrame containing the historical stock data.
        """
        stock = yf.Ticker(ticker)
        data = stock.history(start=start_date, end=end_date)
        return data

    def find_ticker(company_name):
        """
        Finds the ticker symbol for a given company name.

        Parameters:
        company_name (str): The name of the company (e.g., 'Apple Inc.').

        Returns:
        str: The ticker symbol for the company.
        """
        ticker = yf.Ticker(company_name)
        return ticker.info["symbol"]
