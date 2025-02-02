import React, { useState } from "react";
import "./scenario.scss";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { financialSummaryData } from "../../assets/financialSummaryData";
import { LineChart } from "@mui/x-charts/LineChart";

const Scenario = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const scenario = financialSummaryData[currentScenarioIndex];

  const handleNext = () => {
    if (currentScenarioIndex < financialSummaryData.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1);
    }
  };

  // Extract stock data for chart
  const stockData = scenario.stock?.data || [];
  const xAxisData = stockData.map((entry) => entry.date); // Dates for x-axis
  const seriesData = stockData.map((entry) => entry.close); // Closing prices for y-axis

  return (
    <div className="scenario">
      <div className="scenario__text">
        <Typography variant="h3" component="h3">
          {scenario.title}
        </Typography>
        <p className="scenario__text-description">{scenario.summary.text}</p>
      </div>

      <div className="scenario__factor">
        <div className="scenario__factor-grid">
          {scenario.table.rows.map((row, index) => (
            <FormGroup key={index}>
              <div className="scenario__factor-item">
                <div className="scenario__factor-hint">
                  <FormControlLabel control={<Checkbox />} label={row[0]} />
                  <IconButton
                    onClick={() =>
                      setShowHint(index === showHint ? null : index)
                    }
                    size="small"
                  >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </div>
                {showHint === index && (
                  <div className="scenario__factor-hint__text">
                    <p className="scenario__factor-hint__text-pos">{row[1]}</p>
                    <p className="scenario__factor-hint__text-neg">{row[2]}</p>
                  </div>
                )}
              </div>
            </FormGroup>
          ))}
        </div>
      </div>

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

      <div className="scenario__actionButtons">
        <Button variant="contained" color="success">
          Bullish
        </Button>
        <Button variant="contained" color="error">
          Bearish
        </Button>
      </div>

      <div className="scenario__navigation">
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
          disabled={currentScenarioIndex === financialSummaryData.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Scenario;
