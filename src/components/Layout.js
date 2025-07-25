import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="app">
      <Navbar />
      <header className="banner">
        <h1>{location.pathname === '/workout' ? 'Workout Library' : 'The Healthy Grandparent'}</h1>
        <p className="slogan">Supporting Grandparents in their health journey through physical activity</p>
      </header>
      <main className="container">
        {children}
      </main>
    </div>
  );
};

export default Layout; 