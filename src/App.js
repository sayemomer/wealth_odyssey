import React, { useState } from 'react';
import './App.css';
import Button from './components/button/button';
import Scenario from './pages/scenario/scenario';
import Login from './pages/login';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import ScenarioFactors from './pages/scenarioFactors/scenarioFactors';


// Define preset ideal expenditure percentages (in % of income)
const presets = {
  Foodie: {
    dining: 25,
    entertainment: 10,
    groceries: 15,
    transportation: 10,
    others: 20,
  },
  "Impulsive Buyer": {
    dining: 15,
    entertainment: 15,
    groceries: 15,
    transportation: 10,
    others: 10,
  },
  "Budget Conscious": {
    dining: 10,
    entertainment: 5,
    groceries: 15,
    transportation: 10,
    others: 5,
  },
  Shopaholic: {
    dining: 20,
    entertainment: 20,
    groceries: 10,
    transportation: 10,
    others: 10,
  },
  Saver: {
    dining: 10,
    entertainment: 5,
    groceries: 10,
    transportation: 10,
    others: 5,
  },
};

// Calculate baseline savings percentage based on estimated percentages
function calculateBaseline(ideal, estimated) {
  let savings = 0;
  Object.keys(ideal).forEach((cat) => {
    const est = parseFloat(estimated[cat]) || 0;
    // If the user’s estimate is lower than the ideal, they are saving the difference
    const diff = ideal[cat] - est;
    if (diff > 0) {
      savings += diff;
    }
  });
  return savings;
}

// Calculate updated savings percentage based on actual expense amounts
function calculateUpdated(ideal, actualExpenses, income) {
  let savings = 0;
  Object.keys(ideal).forEach((cat) => {
    const expense = parseFloat(actualExpenses[cat]) || 0;
    const actualPercent = (expense / income) * 100;
    const diff = ideal[cat] - actualPercent;
    if (diff > 0) {
      savings += diff;
    }
  });
  return savings;
}

function App() {
  // User demographics and profile
  const [demographics, setDemographics] = useState({
    age: '',
    gender: '',
    location: '',
  });
  const [income, setIncome] = useState('');
  const [preset, setPreset] = useState('Foodie');

  // Estimated expenditure as % of income (initial input)
  const [estimatedExpenditure, setEstimatedExpenditure] = useState({
    dining: '',
    entertainment: '',
    groceries: '',
    transportation: '',
    others: '',
  });

  // Actual expense amounts (in USD)
  const [actualExpenses, setActualExpenses] = useState({
    dining: '',
    entertainment: '',
    groceries: '',
    transportation: '',
    others: '',
  });

  const [baselineSavings, setBaselineSavings] = useState(null);
  const [updatedSavings, setUpdatedSavings] = useState(null);

  // Handler to calculate baseline savings based on estimated percentages
  const handleBaselineCalculate = () => {
    const ideal = presets[preset];
    const savings = calculateBaseline(ideal, estimatedExpenditure);
    setBaselineSavings(savings);
  };

  // Handler to calculate updated savings based on actual expense amounts and income
  const handleUpdatedCalculate = () => {
    const incomeNum = parseFloat(income) || 0;
    if (incomeNum === 0) return;
    const ideal = presets[preset];
    const savings = calculateUpdated(ideal, actualExpenses, incomeNum);
    setUpdatedSavings(savings);
  };

  return (
    <div className="app">
      <h1>Financial Wellness Companion</h1>
      <BrowserRouter>
        <Routes> {/* Wrap your Route components inside <Routes> */}
          <Route path="/scenario" element={<Scenario />} />
          <Route path="/scenarioFact" element={<ScenarioFactors />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>

      {/* User Profile Setup
      <div className="form-section">
        <h2>User Profile Setup</h2>
        <div className="input-group">
          <label>Age:</label>
          <input
            type="number"
            value={demographics.age}
            onChange={(e) =>
              setDemographics({ ...demographics, age: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label>Gender:</label>
          <input
            type="text"
            value={demographics.gender}
            onChange={(e) =>
              setDemographics({ ...demographics, gender: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label>Location:</label>
          <input
            type="text"
            value={demographics.location}
            onChange={(e) =>
              setDemographics({ ...demographics, location: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label>Monthly Income (USD):</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Select Spending Personality:</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
          >
            {Object.keys(presets).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estimated Expenditure Section */}
      {/* <div className="form-section">
        <h2>Estimated Expenditure (Percentage of Income)</h2>
        {Object.keys(presets[preset]).map((cat) => (
          <div className="input-group" key={cat}>
            <label>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}:
            </label>
            <input
              type="number"
              value={estimatedExpenditure[cat]}
              onChange={(e) =>
                setEstimatedExpenditure({
                  ...estimatedExpenditure,
                  [cat]: e.target.value,
                })
              }
            />
          </div>
        ))}
        <button onClick={handleBaselineCalculate}>
          Calculate Baseline Savings (%)
        </button>
        {baselineSavings !== null && (
          <div className="result">
            Baseline Savings: {baselineSavings.toFixed(2)}%
          </div>
        )}
      </div>

      {/* Actual Expense Section */}
      {/* <div className="form-section">
        <h2>Actual Expenses (in USD)</h2>
        {Object.keys(presets[preset]).map((cat) => (
          <div className="input-group" key={cat}>
            <label>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}:
            </label>
            <input
              type="number"
              value={actualExpenses[cat]}
              onChange={(e) =>
                setActualExpenses({
                  ...actualExpenses,
                  [cat]: e.target.value,
                })
              }
            />
          </div>
        ))}
        <button onClick={handleUpdatedCalculate}>
          Calculate Updated Savings (%)
        </button>
        {updatedSavings !== null && (
          <div className="result">
            Updated Savings: {updatedSavings.toFixed(2)}%
          </div>
        )}
      </div>  */}
    </div>
  );
}

export default App;
