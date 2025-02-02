import React, { useState, useEffect } from "react";
import "./scenario.scss";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { financialSummaryData } from "../../assets/financialSummaryData";
import { LineChart } from "@mui/x-charts/LineChart";
import { scenatioData } from "../../assets/scenatioData";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const Scenario = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [resultText, setResultText] = useState(null);
  const navigate = useNavigate();
  const scenario = financialSummaryData[currentScenarioIndex];
  const { width, height } = useWindowSize();
  const [savings, setSavings] = useState(0);

  const handleBullishClick = () => {
    setShowResponse(true);
    setButtonsDisabled(true);

    // Determine WIN or LOSE based on stock data
    const stockData = scenario.stock?.data || [];
    const firstValue = stockData.length > 0 ? stockData[0].close : 0;
    const lastValue =
      stockData.length > 0 ? stockData[stockData.length - 1].close : 0;
    setResultText(lastValue > firstValue ? "WIN" : "LOSE");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleReinvest = () => {
    if (currentScenarioIndex < scenatioData.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setShowResponse(false);
      setButtonsDisabled(false);
      setResultText(null);
    }
  };

  // Extract stock data for chart
  const stockData = scenario.stock?.data || [];
  const xAxisData = stockData.map((entry) => entry.date); // Dates for x-axis
  const seriesData = stockData.map((entry) => entry.close); // Closing prices for y-axis

  // Extract investment factors
  const investmentFactors =
    scenario.investment_factors?.most_likely_factors || {};

  // Confetti factors
  const stop = false;
  const confettiNum = 700;

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData && storedUserData.saving) {
      setSavings(storedUserData.saving);
    } else {
      setSavings(1000); // Default value if no data is found
    }
  }, []);
  

  return (
    <Container maxWidth="md">
      {resultText === "WIN" && (
        <Confetti
          width={width}
          height={height}
          recycle={stop}
          numberOfPieces={confettiNum}
        />
      )}
      <Card className="scenario-card" sx={{ mt: 4 }}>
        <CardContent>
          <Box className="scenario-header" sx={{ mb: 2, textAlign: "center" }}>
            <Typography variant="h4" component="h3">
              {scenario.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Cash: ${savings.toFixed(2)}
            </Typography>
          </Box>
          <Divider />
          <Box className="scenario-description" sx={{ my: 2 }}>
            <Typography variant="body1">{scenario.summary.text}</Typography>
          </Box>
          <Box className="scenario-actionButtons" sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleBullishClick}
              disabled={buttonsDisabled}
              sx={{ mx: 1 }}
            >
              Bullish
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={buttonsDisabled}
              sx={{ mx: 1 }}
            >
              Bearish
            </Button>
          </Box>
        </CardContent>
      </Card>
      {showResponse && (
        <Paper className="response-section" elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Stock Price Trend ({scenario.stock.symbol})
          </Typography>
          <LineChart
            xAxis={[{ scaleType: "point", data: xAxisData }]}
            series={[
              {
                data: seriesData,
                label: "Closing Price",
              },
            ]}
            width={600}
            height={300}
          />
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            {resultText}
          </Typography>
          <Box className="investment-factors" sx={{ mt: 3 }}>
            <Typography variant="h6" align="center">
              Investment Factors
            </Typography>
            <ul>
              {Object.entries(investmentFactors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </Box>
          <Box
            className="response-buttons"
            sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleReinvest}
              sx={{ px: 3 }}
            >
              Re-invest
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleHomeClick}
              sx={{ px: 3 }}
            >
              Home
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Scenario;
