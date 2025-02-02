import React from 'react';
import './App.css';
import Button from './components/button/button';
import Scenario from './pages/scenario/scenario';
import Login from './pages/login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/homePage/homePage';
import GameInfoPage from './pages/GameInfoPage/GameInfoPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/scenario" element={<Scenario />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/gameinfo" element={<GameInfoPage/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
