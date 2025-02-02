import React, { useState, useEffect } from "react";
import "./scenarioFactors.scss";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { scenatioData } from "../../assets/scenatioData";

// To do: When click re-invest the checkboxes dont reset

const ScenarioFactors = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(false);
  const [checkedFactors, setCheckedFactors] = useState([]);
  const [savings, setSavings] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [matchedFactors, setMatchedFactors] = useState([]);
  const scenario = scenatioData[currentScenarioIndex];

  useEffect(() => {
    const storedSavings = JSON.parse(localStorage.getItem("userSavings")) || {
      amount: 1000,
    };
    setSavings(storedSavings.amount);
  }, []);

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
    const matched = checkedFactors.filter((factor) =>
      mostLikelyFactors.includes(factor)
    );

    setMatchedFactors(matched);

    const matchPercentage = (matched.length / mostLikelyFactors.length) * 100;

    if (matchPercentage > 60) {
      const newSavings = savings * 1.05;
      setSavings(newSavings);
      localStorage.setItem(
        "userSavings",
        JSON.stringify({ amount: newSavings })
      );
    }
  };

  const handleBullishClick = () => {
    setShowResponse(true);
    setButtonsDisabled(true);
    handleFactorChecker();
  };

  const handleResetSavings = () => {
    setSavings(1000);
    setButtonsDisabled(false);
    localStorage.setItem("userSavings", JSON.stringify({ amount: 1000 }));
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleReinvest = () => {
    if (currentScenarioIndex < scenatioData.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setShowResponse(false);
      setButtonsDisabled(false);
      setCheckedFactors([]);
      setMatchedFactors([]);
      // document.querySelectorAll("input[type=checkbox]").forEach((el) => (el.checked = false));
      // setCheckedFactors([]);
    }
  };

  const handleNext = () => {
    if (currentScenarioIndex < scenatioData.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    }
  };

  const mostLikelyFactors = Object.keys(
    scenario.investment_factors.most_likely_factors
  ).map(Number);

  const unmatchedFactors = mostLikelyFactors
    .filter((factor) => !matchedFactors.includes(factor))
    .map((factor) => ({
      name:
        scenario.table.rows.find((row) => row[3] === `factor_${factor}`)?.[0] ||
        `Factor ${factor}`,
      text: scenario.investment_factors.most_likely_factors[factor],
    }));

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
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleResetSavings}
            >
              Reset Savings
            </Button> */}
          </div>
        </div>
      </section>
      {showResponse && (
        <section className="response">
          <div className="response__factorChecker">
            {`${matchedFactors.length} out of ${mostLikelyFactors.length} factors matched.`}
            {unmatchedFactors.length > 0 && (
              <div>
                <p>Factors not selected:</p>
                <ul>
                  {unmatchedFactors.map((factor, index) => (
                    <li key={index}>
                      <strong>{factor.name}:</strong> {factor.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="response__buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleReinvest}
              // disabled={currentScenarioIndex === scenatioData.length - 1}
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

export default ScenarioFactors;
