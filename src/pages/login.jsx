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
import { userData } from "../assets/userData";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    income: "",
    userPersona: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem("userData", JSON.stringify(formData));
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
          {userData.map((user, index) => (
            <MenuItem key={index} value={user.selected_persona.name}>
              {user.selected_persona.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
        Start
      </Button>
    </div>
  );
};

export default Login;
