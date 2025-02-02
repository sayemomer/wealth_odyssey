import React, { useState } from "react";
import "./scenario.scss";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import { scenatioData } from "../../assets/scenatioData";

const Scenario = () => {
  const [showHint, setShowHint] = useState(false);
  const scenario = scenatioData[0];
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="scenario">
      <div className="scenario__text">
        <Typography variant="h3" component="h3">
          Scenario Title
        </Typography>
        <p className="scenario__text-description">{scenario.summary.text}</p>
      </div>
      <div className="scenario__factor">
      <div className="scenario__factor-grid">

        {scenario.table.rows.map((row, index) => (
          <FormGroup>
            <div key={index} className="scenario__factor-item">
              <div className="scenario__factor-hint">
                <FormControlLabel control={<Checkbox />} label={row[0]} />
                <IconButton
                  onClick={() => setShowHint(index === showHint ? null : index)}
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
      <Button variant="contained" color="success">
        Bullish
      </Button>
      <Button variant="contained" color="error">
        Bearish
      </Button>
    </div>
  );
};

export default Scenario;
