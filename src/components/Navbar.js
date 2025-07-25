import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Navbar() {
  const navigate = useNavigate(); // Retain for potential future non-auth related navigation
  const { isLoggedIn, username, role, logout } = useAuth(); // Use isLoggedIn, username, and logout from AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/'); // Navigate to home page after logout
  };

  return (
    <nav className="nav">
      <div className="nav-brand">
        {/* Removed redundant brand text */}
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-button">Home</Link>
        <Link to="/about" className="nav-button">About Us</Link>
        {isLoggedIn ? (
          <>
            <Link to="/membership-main" className="nav-button">Workout Library</Link>
            {role === 'coach' && (
              <Link to="/coach" className="nav-button">Coach</Link>
            )}
            <span className="welcome-message">
              {role === 'coach' ? (
                <>
                  Welcome <span style={{ background: '#27ae60', color: 'white', fontWeight: 600, padding: '2px 10px', borderRadius: '6px', marginLeft: 2 }}>Coach {username}</span>
                </>
              ) : (
                <>Welcome, {username}!</>
              )}
            </span>
            <button onClick={handleLogout} className="nav-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/signup" className="nav-button">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 