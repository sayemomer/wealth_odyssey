import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import "./AnimatedStartButton.scss";

const AnimatedStartButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/scenarioFactors");
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className="animated-button"
      onClick={handleClick}
    >
      Start
    </Button>
  );
};

export default AnimatedStartButton;
