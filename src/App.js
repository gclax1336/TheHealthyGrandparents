import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Workout from './pages/Workout';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import AboutUs from './pages/AboutUs';
import SignUp from './pages/SignUp';
import { useAuth, AuthProvider } from './context/AuthContext';
import CoachDashboard from './pages/CoachDashboard';
import CreateWorkout from './pages/CreateWorkout';
import { migrateWorkoutProgramsToLocalStorage } from './data/workoutPrograms';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import VerifyEmail from './pages/VerifyEmail';
import RequireAuth from './components/RequireAuth';

// Create a client
const queryClient = new QueryClient();

// Protect coach-only routes
function RequireCoach({ children }) {
  const { isLoggedIn, role } = useAuth();
  return isLoggedIn && role === 'coach' ? children : <Navigate to="/membership-main" replace />;
}

// Migration component to handle one-time data setup
const DataMigration = () => {
  useEffect(() => {
    const workouts = localStorage.getItem('workouts');
    if (!workouts) {
      migrateWorkoutProgramsToLocalStorage();
    }
  }, []);
  return null;
};

function App() {
  const { isLoggedIn } = useAuth();
  
  return (
    <AuthProvider>
      <DataMigration />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route 
                path="/login" 
                element={!isLoggedIn ? <Login /> : <Navigate to="/membership-main" />} 
              />
              <Route 
                path="/signup" 
                element={!isLoggedIn ? <SignUp /> : <Navigate to="/membership-main" />} 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/workout" 
                element={<RequireAuth><Workout /></RequireAuth>} 
              />
              <Route 
                path="/membership-main" 
                element={<RequireAuth><MemberDashboard /></RequireAuth>} 
              />
              {/* Coach Route */}
              <Route 
                path="/coach" 
                element={<RequireCoach><CoachDashboard /></RequireCoach>} 
              />
              <Route
                path="/coach/create-workout"
                element={<RequireCoach><CreateWorkout /></RequireCoach>}
              />
              <Route
                path="/coach/edit-workout/:id"
                element={<RequireCoach><CreateWorkout /></RequireCoach>}
              />
              <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="/payment-result" element={<RequireAuth><PaymentResult /></RequireAuth>} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;