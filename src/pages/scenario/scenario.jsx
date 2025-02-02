import React, { useState } from "react";
import "./scenario.scss";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { financialSummaryData } from "../../assets/financialSummaryData";
import { LineChart } from "@mui/x-charts/LineChart";
import { scenatioData } from "../../assets/scenatioData";

const Scenario = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const scenario = financialSummaryData[currentScenarioIndex];
  const [showResponse, setShowResponse] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleBullishClick = () => {
    setShowResponse(true);
    setButtonsDisabled(true);
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleReinvest = () => {
    if (currentScenarioIndex < scenatioData.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setShowResponse(false);
      setButtonsDisabled(false);
    }
  };

  // Extract stock data for chart
  const stockData = scenario.stock?.data || [];
  const xAxisData = stockData.map((entry) => entry.date); // Dates for x-axis
  const seriesData = stockData.map((entry) => entry.close); // Closing prices for y-axis

  return (
    <>
      <section className="question">
        <div className="scenario">
          <div className="scenario__text">
            <Typography variant="h3" component="h3">
              {scenario.title}
            </Typography>
            <p className="scenario__text-description">
              {scenario.summary.text}
            </p>
          </div>

          <div className="scenario__actionButtons">
            <Button
              variant="contained"
              color="success"
              onClick={handleBullishClick}
              disabled={buttonsDisabled}
            >
              Bullish
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={buttonsDisabled}
            >
              Bearish
            </Button>
          </div>
        </div>
      </section>
      {showResponse && (
        <section className="response">
          {/* LineChart for Stock Data */}
          <div className="scenario__chart">
            <Typography variant="h6" component="h6">
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
          </div>
          <div className="response__buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleReinvest}
            >
              Re-invest
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleHomeClick}
            >
              Home
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default Scenario;

// const handleNext = () => {
//   if (currentScenarioIndex < financialSummaryData.length - 1) {
//     setCurrentScenarioIndex(currentScenarioIndex + 1);
//   }
// };

// const handlePrevious = () => {
//   if (currentScenarioIndex > 0) {
//     setCurrentScenarioIndex(currentScenarioIndex - 1);
//   }
// };

{
  /* <div className="scenario__navigation">
            <Button
              variant="contained"
              onClick={handlePrevious}
              disabled={currentScenarioIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                currentScenarioIndex === financialSummaryData.length - 1
              }
            >
              Next
            </Button>
          </div> */
}
