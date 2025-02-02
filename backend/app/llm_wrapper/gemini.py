import google.generativeai as genai


def generate_summary(mdna_text):
    genai.configure(api_key="")
    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(
        "first TLDR this mdna with max 200 words"
        + "Analyze the Management’s Discussion and Analysis (MD&A) section from the SEC 10-Q filing and generate a structured summary focusing on key financial insights, risks, and management outlook. Ensure the summary is concise, clear, and decision-oriented. Follow this structure:Financial Performance Overview summarize revenue, profit, and key financial metrics. Highlight significant changes (YoY or QoQ) and underlying reasons. Key Risks & Challenges Identify major risks discussed by management.Provide context on potential impacts and mitigation strategies. Management Strategy & Outlook Summarize the company’s strategic priorities and future expectations. Include growth drivers, cost-cutting measures, and market positioning. Market & Competitive Landscape Highlight any insights on industry trends, competitive positioning, or external factors affecting performance.Ensure the summary is objective, data-backed, and free from unnecessary jargon. Present insights in a way that helps investors make informed decisions quickly."
        ", Second: You need to come up with 10  factors in a table format by which user can decide to invest in this company or not . "
        + mdna_text
    )
    return response.text


if __name__ == "__main__":
    mdna_text = 