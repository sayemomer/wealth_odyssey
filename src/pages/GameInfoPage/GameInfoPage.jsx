import React from "react";
import { Container, Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import "./GameInfoPage.scss";
import AnimatedStartButton from "./AnimatedStartButton";

const GameRules = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Game Rules
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to the Investment Analysis Game! Follow these rules to maximize your savings.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="1. Carefully read the company's financial summary provided." />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Review the 10 investment factors listed in the table." />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Click on a factor to select it; your choice will be highlighted." />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Click the 'Confirm Selection' button to submit your choice." />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. If your selection matches the correct investment factor, profit will be added to your savings." />
            </ListItem>
            <ListItem>
              <ListItemText primary="6. Incorrect selections do not add profit. Review the summary and try again." />
            </ListItem>
            <ListItem>
              <ListItemText primary="7. Use your accumulated savings to invest further and enhance your portfolio." />
            </ListItem>
            <ListItem>
              <ListItemText primary="8. Enjoy the game and learn key financial analysis insights along the way!" />
            </ListItem>
            
          </List>

        </Paper>

      </Box>
      <AnimatedStartButton />
    </Container>
  );
};

export default GameRules;
