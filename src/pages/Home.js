import React, { useState, useEffect } from 'react';
import { workoutPrograms } from '../data/workoutPrograms';
import logo from '../assets/Logo.png'; // Use capital L to match the file

// Deterministically pick a workout and day based on the current date
function getWorkoutOfTheDay() {
  const today = new Date();
  // Get day of year
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Flatten all program days into a single array
  const allDays = workoutPrograms.flatMap(program =>
    program.days.map(day => ({ program, day }))
  );
  // Pick a workout deterministically
  const workoutIndex = dayOfYear % allDays.length;
  return allDays[workoutIndex];
}

const Home = () => {
  const [wod, setWod] = useState(null);
  const [today, setToday] = useState('');

  useEffect(() => {
    setWod(getWorkoutOfTheDay());
    const now = new Date();
    setToday(now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
  }, []);

  return (
    <div className="home-container">
      <section className="workout-section">
        <div className="workout-content" style={{
          background: '#f8f9fa',
          borderRadius: '16px',
          padding: '3rem 2rem',
          maxWidth: '1800px',
          margin: '2rem auto',
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Logo only above the workout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2.5rem',
            width: '100%',
            textAlign: 'center',
          }}>
            <img
              src={logo}
              alt="The Healthy Grandparent Logo"
              style={{ height: '192px', width: 'auto', flexShrink: 0 }}
            />
          </div>
          <div className="workout-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {/* Date as plain text */}
            <h2 style={{ fontSize: '4.5rem' }}>{today}</h2>
            <h2 style={{ fontSize: '4.5rem' }}>Workout of the Day</h2>
            {/* Decorative red bar spacer */}
            <div style={{ width: '100%', height: '6px', background: '#B22222', borderRadius: '3px', margin: '2rem 0' }}></div>
            {wod && (
              <>
                <h3 style={{ color: '#333', margin: '3rem 0 1.5rem', fontSize: '3.6rem' }}>{wod.program.category}</h3>
                <div style={{ color: '#666', marginBottom: '3rem', fontSize: '2.7rem' }}>{wod.day.title}</div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {wod.day.exercises.map((ex, idx) => (
                    <li key={idx} style={{ background: '#f8f9fa', borderRadius: 6, margin: '1.5rem 0', padding: '2.25rem', fontSize: '2.7rem' }}>
                      <span style={{ fontWeight: 500 }}>{ex.name}</span>
                      {ex.details && <span style={{ color: '#555' }}> – {ex.details}</span>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 