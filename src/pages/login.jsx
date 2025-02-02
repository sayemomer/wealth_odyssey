import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { spendingPersonasData } from "../assets/spendingPersonasData"; // Assuming this is an array of objects

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    income: "",
    userPersona: ""
  });
  const [updatedIncome, setUpdatedIncome] = useState(null); // To store the updated income

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Get the selected persona data
    const selectedPersona = formData.userPersona;
    const personaData = spendingPersonasData[0][selectedPersona]; // Fetch data of the selected persona
    if (personaData) {
      // Sum up all the percentages of the categories for the selected persona
      const totalPercentage = Object.values(personaData).reduce((acc, curr) => acc + curr, 0);
      // Calculate the deduction from the income based on the total percentage
      const deductionAmount = (formData.income * totalPercentage) / 100;
      const newIncome = formData.income - deductionAmount;
      setUpdatedIncome(newIncome); // Update the income with the deduction

      // Update the form data with the new income
      const updatedFormData = { ...formData, saving: newIncome };
  
      // Save the updated form data (including new income) to local storage
      localStorage.setItem("userData", JSON.stringify(updatedFormData));
    }
    navigate("/scenario");
  };

  return (
    <div className="login">
      <FormControl fullWidth margin="normal">
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Income"
          type="number"
          variant="outlined"
          name="income"
          value={formData.income}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>User Persona</InputLabel>
        <Select
          name="userPersona"
          value={formData.userPersona}
          onChange={handleChange}
        >
          {Object.keys(spendingPersonasData[0]).map((persona, index) => (
            <MenuItem key={index} value={persona}>
              {persona}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
        Start
      </Button>

      {/* Optionally, display the updated income */}
      {updatedIncome !== null && (
        <div className="updated-income">
          <h3>Updated Income: ${updatedIncome.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default Login;
