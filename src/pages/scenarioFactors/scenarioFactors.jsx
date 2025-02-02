import React, { useState, useEffect } from "react";
import "./scenarioFactors.scss";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { scenatioData } from "../../assets/scenatioData";

const ScenarioFactors = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [checkedFactors, setCheckedFactors] = useState([]);
  const scenario = scenatioData[currentScenarioIndex];
  const [savings, setSavings] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [matcFactors, setmatcFactors] = useState([]);

  const handleFactorCheck = (index) => {
    setCheckedFactors((prevChecked) =>
      prevChecked.includes(index)
        ? prevChecked.filter((item) => item !== index)
        : [...prevChecked, index]
    );
  };

  const handleFactorChecker = () => {
    const mostLikelyFactors = Object.keys(
      scenario.investment_factors.most_likely_factors
    ).map(Number);
    const matchedFactors = checkedFactors.filter((factor) =>
      mostLikelyFactors.includes(factor)
    );

    setmatcFactors(matchedFactors);

    const matchPercentage =
      (matchedFactors.length / mostLikelyFactors.length) * 100;

    if (matchPercentage > 60) {
      const newSavings = savings * 1.05;
      setSavings(newSavings);
      localStorage.setItem(
        "userSavings",
        JSON.stringify({ amount: newSavings })
      );
    }

    return `${matchedFactors.length} out of ${mostLikelyFactors.length} factors matched.`;
  };

  console.log(scenario.table.rows);
  console.log(scenario.investment_factors.most_likely_factors);

  const handleBullishClick = () => {
    setButtonsDisabled(true);
    setShowResponse(true);
    handleFactorChecker();
  };

  const handleResetSavings = () => {
    setSavings(1000);
    localStorage.setItem("userSavings", JSON.stringify({ amount: 1000 }));
  };

  useEffect(() => {
    const storedSavings = JSON.parse(localStorage.getItem("userSavings")) || {
      amount: 1000,
    };
    setSavings(storedSavings.amount);
  }, []);

  return (
    <>
      <section className="question">
        <div className="scenario">
          <div className="scenario__headingContainer">
            <Typography variant="h3" component="h3">
              {scenario.title}
            </Typography>
            <p className="scenario__cash">{savings}</p>
          </div>
          <div className="scenario__text">
            <p className="scenario__text-description">
              {scenario.summary.text}
            </p>
          </div>
          <div className="scenario__factor">
            <div className="scenario__factor-grid">
              {scenario.table.rows.map((row, index) => (
                <FormGroup key={index}>
                  <div className="scenario__factor-item">
                    <div className="scenario__factor-hint">
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() => handleFactorCheck(index + 1)}
                          />
                        }
                        label={row[0]}
                      />
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
                        <p className="scenario__factor-hint__text-pos">
                          {row[1]}
                        </p>
                        <p className="scenario__factor-hint__text-neg">
                          {row[2]}
                        </p>
                      </div>
                    )}
                  </div>
                </FormGroup>
              ))}
            </div>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetSavings}
            >
              Reset Savings
            </Button>
          </div>
        </div>
      </section>
      {showResponse && (
        <section className="response">
          <div className="response__factorChecker">
            {`${matcFactors.length} out of  ${
              Object.keys(scenario.investment_factors.most_likely_factors).map(
                Number
              ).length
            } factors matched.`}
            
          </div>
        </section>
      )}
    </>
  );
};

export default ScenarioFactors;

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
          disabled={currentScenarioIndex === scenatioData.length - 1}
        >
          Next
        </Button>
      </div> */
}
