import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { scenatioData } from "../../assets/scenatioData";
import "./scenarioFactors.scss";

const ScenarioFactors = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(null);
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
      localStorage.setItem("userSavings", JSON.stringify({ amount: newSavings }));
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
    <Container maxWidth="md">
      <Card className="scenario-card">
        <CardContent>
          <Box className="scenario-header" sx={{ mb: 2 }}>
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
          <Box className="scenario-factors">
            <Grid container spacing={2}>
              {scenario.table.rows.map((row, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper className="factor-item" elevation={2}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() => handleFactorCheck(index + 1)}
                            checked={checkedFactors.includes(index + 1)}
                          />
                        }
                        label={row[0]}
                      />
                      <IconButton
                        onClick={() =>
                          setShowHint(showHint === index ? null : index)
                        }
                        size="small"
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </FormGroup>
                    {showHint === index && (
                      <Box className="hint-text" sx={{ mt: 1 }}>
                        <Typography variant="body2" color="primary">
                          {row[1]}
                        </Typography>
                        <Typography variant="body2" color="error">
                          {row[2]}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box className="action-buttons" sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleBullishClick}
              disabled={buttonsDisabled}
              className="animated-button"
            >
              Bullish
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={buttonsDisabled}
              className="animated-button"
            >
              Bearish
            </Button>
          </Box>
        </CardContent>
      </Card>
      {showResponse && (
        <Paper className="response-section" elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" align="center" gutterBottom>
            {`${matchedFactors.length} out of ${mostLikelyFactors.length} factors matched.`}
          </Typography>
          {unmatchedFactors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Factors not selected:</Typography>
              <ul>
                {unmatchedFactors.map((factor, index) => (
                  <li key={index}>
                    <strong>{factor.name}:</strong> {factor.text}
                  </li>
                ))}
              </ul>
            </Box>
          )}
          <Box
            className="response-buttons"
            sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleReinvest}
              className="animated-button"
            >
              Re-invest
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleHomeClick}
              className="animated-button"
            >
              Home
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ScenarioFactors;
