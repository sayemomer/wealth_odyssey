import React from "react";
import { Container, Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./homePage.scss";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <Container maxWidth="lg" className="homePage">
      {/* Hero Section */}
      <Box className="hero" sx={{ py: 6, textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Overlay for better readability */}
        <Box className="overlay" />
        <Typography variant="h2" component="h1" gutterBottom>
          Financial Wellness Companion
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Empower Your Financial Future
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Our mission is to empower you with personalized financial insights, budgeting tools, and a clear roadmap to achieve financial wellness.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Whether you're planning for retirement, saving for your dream home, or managing everyday expenses, our platform is designed to guide you toward financial freedom.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          color="primary" 
          onClick={handleGetStarted}
          className="animated-button"
        >
          Get Started
        </Button>
      </Box>

      {/* Goals Section */}
      <Box className="goals" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                Our Goals
              </Typography>
              <Typography variant="body1">
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li>Personalized Financial Insights</li>
                  <li>Effective Budgeting Tools</li>
                  <li>Guided Roadmap to Financial Wellness</li>
                  <li>Empowerment to Achieve Financial Freedom</li>
                </ul>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
