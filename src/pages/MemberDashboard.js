import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MemberDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, username } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Unique, targeted descriptions for each program
  const workoutLibrary = [
    {
      id: 'balance-fall-prevention',
      category: 'Balance & Fall Prevention',
      title: 'Balance & Fall Prevention',
      description: 'Improve stability, coordination, and reduce the risk of falls with targeted balance and movement routines.'
    },
    {
      id: 'joint-pain-arthritis',
      category: 'Joint Pain & Arthritis',
      title: 'Joint Pain & Arthritis',
      description: 'Ease joint pain, increase mobility, and support arthritis management with gentle, joint-friendly exercises.'
    },
    {
      id: 'osteoporosis-bone-health',
      category: 'Osteoporosis & Bone Health',
      title: 'Osteoporosis & Bone Health',
      description: 'Strengthen bones and support bone density with weight-bearing, resistance, and balance exercises.'
    },
    {
      id: 'diabetes-blood-sugar',
      category: 'Diabetes & Blood Sugar Management',
      title: 'Diabetes & Blood Sugar Management',
      description: 'Help regulate blood sugar and improve insulin sensitivity with a mix of cardio, strength, and flexibility routines.'
    },
    {
      id: 'heart-health-cardiovascular',
      category: 'Heart Health & Cardiovascular Fitness',
      title: 'Heart Health & Cardiovascular Fitness',
      description: 'Boost cardiovascular health, endurance, and circulation with low-impact aerobic and strength workouts.'
    },
    {
      id: 'chronic-pain-fibromyalgia',
      category: 'Chronic Pain & Fibromyalgia',
      title: 'Chronic Pain & Fibromyalgia',
      description: 'Manage chronic pain and fibromyalgia symptoms with gentle movement, stretching, and relaxation techniques.'
    },
    {
      id: 'cognitive-decline-memory',
      category: 'Cognitive Decline & Memory Support',
      title: 'Cognitive Decline & Memory Support',
      description: 'Support memory, focus, and brain health with coordination, movement, and cognitive challenge activities.'
    },
    {
      id: 'respiratory-health-breathing',
      category: 'Respiratory Health & Breathing',
      title: 'Respiratory Health & Breathing',
      description: 'Enhance lung capacity, breathing efficiency, and posture with targeted respiratory and movement exercises.'
    },
    {
      id: 'depression-mood',
      category: 'Depression & Mood Improvement',
      title: 'Depression & Mood Improvement',
      description: 'Lift mood, reduce stress, and boost energy with movement, mindfulness, and relaxation routines.'
    },
    {
      id: 'obesity-weight-management',
      category: 'Obesity & Weight Management',
      title: 'Obesity & Weight Management',
      description: 'Support healthy weight loss and management with a blend of cardio, strength, and flexibility workouts.'
    }
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {username}!</h1>
      </div>
      
      <div className="workout-library">
        <h2>Workout Library</h2>
        <div className="workout-grid">
          {workoutLibrary.map(workout => (
            <div key={workout.id} className="workout-card">
              <div className="workout-category" style={{ fontWeight: 'bold', color: '#007bff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {workout.category}
              </div>
              <p className="workout-description">{workout.description}</p>
              <Link to={`/workout?program=${workout.id}`} className="start-workout-button" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                Go to Workouts
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard; 