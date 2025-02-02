import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { spendingPersonasData } from "../assets/spendingPersonasData"; // Assuming this is an array of objects
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    income: "",
    userPersona: ""
  });

  // Maintain custom percentages for each spending category.
  // These will be loaded from the persona defaults when a persona is selected.
  const [customPercentages, setCustomPercentages] = useState({
    dining: 25,
    entertainment: 10,
    groceries: 15,
    transportation: 10,
    others: 20
  });

  // Initialize updatedIncome (savings) to 0
  const [updatedIncome, setUpdatedIncome] = useState(0);

  // Recalculate updatedIncome whenever income or custom percentages change.
  useEffect(() => {
    if (formData.income) {
      const totalPercentage = Object.values(customPercentages).reduce(
        (acc, curr) => acc + Number(curr),
        0
      );
      const deductionAmount = (Number(formData.income) * totalPercentage) / 100;
      const newIncome = Number(formData.income) - deductionAmount;
      setUpdatedIncome(newIncome);
    } else {
      setUpdatedIncome(0);
    }
  }, [formData.income, customPercentages]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "userPersona") {
      // Update both formData and load the default percentages from the persona data.
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      const personaData = spendingPersonasData[0][value];
      if (personaData) {
        setCustomPercentages(personaData);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Routes to the next page with the current selections.
  const handleSubmit = () => {
    const updatedFormData = { 
      ...formData, 
      saving: updatedIncome, 
      customPercentages 
    };
    localStorage.setItem("userData", JSON.stringify(updatedFormData));
    navigate("/gameinfo", { state: updatedFormData });
  };

  // Optional: Save data without navigating
  const handleSave = () => {
    const updatedFormData = { 
      ...formData, 
      saving: updatedIncome, 
      customPercentages 
    };
    localStorage.setItem("userData", JSON.stringify(updatedFormData));
    console.log("Data saved to local storage:", JSON.stringify(updatedFormData));
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome to Financial Wellness Companion
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Start tracking your finances and build a healthier financial future.
            </Typography>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label="Income"
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>User Persona</InputLabel>
                    <Select
                      label="User Persona"
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
                </Grid>
                {Object.keys(customPercentages).map((category, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </InputLabel>
                      <Select
                        name={category}
                        value={customPercentages[category]}
                        onChange={(e) =>
                          setCustomPercentages((prev) => ({
                            ...prev,
                            [category]: e.target.value,
                          }))
                        }
                        label={category.charAt(0).toUpperCase() + category.slice(1)}
                      >
                        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                          <MenuItem key={num} value={num}>
                            {num}%
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSave}
                className="animated-button save-button"
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                className="animated-button start-button"
              >
                Start Investing your savings
              </Button>
            </Box>
            <Box mt={2} textAlign="center">
              <Typography variant="h6">
                Savings: ${Number(updatedIncome).toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
