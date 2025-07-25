import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || 'member';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  }, [isLoggedIn, username, role]);

  const login = (user, pass) => {
    let role = 'member';
    if (user === 'Grant' && pass === 'Grant') {
      setIsLoggedIn(true);
      setUsername(user);
      setRole('coach');
      role = 'coach';
    } else if (user && pass) {
      setIsLoggedIn(true);
      setUsername(user);
      setRole('member');
      role = 'member';
    } else {
      return { success: false };
    }
    // Update members list in localStorage
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const now = new Date().toISOString();
    const idx = members.findIndex(m => m.username === user);
    if (idx !== -1) {
      members[idx].lastLogin = now;
      members[idx].role = role;
      if (!members[idx].email) {
        members[idx].email = `${user.toLowerCase()}@demo.com`;
      }
    } else {
      members.push({ username: user, lastLogin: now, role, email: `${user.toLowerCase()}@demo.com` });
    }
    localStorage.setItem('members', JSON.stringify(members));
    return { success: true, role };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setRole('member');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 