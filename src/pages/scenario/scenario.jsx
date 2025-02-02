import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Popover } from "@base-ui-components/react/popover";
import { scenatioData } from "../../assets/scenatioData";

const Scenario = () => {
  const [showHint, setShowHint] = useState(false);
  const scenario = scenatioData[0];

  return (
    <div className="scenario">
      <div className="scenario__text">
        <Typography variant="h3" component="h3">
          Scenario Title
        </Typography>
        <p className="scenario__text-description">
          {scenario.summary.text}
        </p>
      </div>
      <div className="scenario__factor">
        {scenario.table.rows.map((row, index) => (
          <div key={index} className="scenario__factor-item">
            <p className="scenario__factor-text">{row[0]}</p>
            <div className="scenario__factor-hint">
              <Button variant="contained" onClick={() => setShowHint(index === showHint ? null : index)}>
                Hint
              </Button>
              {showHint === index && (
                <div className="scenario__factor-hint__text">
                  {row[1]} | {row[2]}
                </div>
              )}
            </div>
          </div>
        ))}
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
