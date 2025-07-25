import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getWorkoutsFromStorage = () => {
  const saved = localStorage.getItem('workouts');
  return saved ? JSON.parse(saved) : [];
};
const saveWorkoutsToStorage = (workouts) => {
  localStorage.setItem('workouts', JSON.stringify(workouts));
};

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { username } = useAuth();
  const [form, setForm] = useState({
    title: '',
    category: '',
    workout: '',
    stretching: ''
  });
  const [warmupMovements, setWarmupMovements] = useState([]);
  const [showWarmupForm, setShowWarmupForm] = useState(false);
  const [newWarmup, setNewWarmup] = useState({
    title: '',
    reps: '',
    description: '',
    note: ''
  });
  const [editWarmupIdx, setEditWarmupIdx] = useState(null);
  const [workoutMovements, setWorkoutMovements] = useState([]);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [newWorkoutMovement, setNewWorkoutMovement] = useState({
    title: '',
    reps: '',
    description: '',
    note: ''
  });
  const [editWorkoutIdx, setEditWorkoutIdx] = useState(null);
  const [stretchingMovements, setStretchingMovements] = useState([]);
  const [showStretchingForm, setShowStretchingForm] = useState(false);
  const [newStretchingMovement, setNewStretchingMovement] = useState({
    title: '',
    reps: '',
    description: '',
    note: ''
  });
  const [editStretchingIdx, setEditStretchingIdx] = useState(null);
  const [challengeMovements, setChallengeMovements] = useState([]);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [newChallengeMovement, setNewChallengeMovement] = useState({
    title: '',
    reps: '',
    description: '',
    note: ''
  });
  const [editChallengeIdx, setEditChallengeIdx] = useState(null);

  // Load workout if editing
  useEffect(() => {
    if (id) {
      const workouts = getWorkoutsFromStorage();
      const workout = workouts.find(w => w.id === id);
      if (workout) {
        setForm({ title: workout.title, category: workout.category });
        setWarmupMovements(workout.warmupMovements || []);
        setWorkoutMovements(workout.workoutMovements || []);
        setStretchingMovements(workout.stretchingMovements || []);
        setChallengeMovements(workout.challengeMovements || []);
      }
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWarmupChange = e => {
    setNewWarmup({ ...newWarmup, [e.target.name]: e.target.value });
  };

  const handleAddWarmup = e => {
    e.preventDefault();
    setWarmupMovements([...warmupMovements, newWarmup]);
    setNewWarmup({ title: '', reps: '', description: '', note: '' });
    setShowWarmupForm(false);
  };

  const handleEditWarmup = idx => {
    setEditWarmupIdx(idx);
    setNewWarmup(warmupMovements[idx]);
    setShowWarmupForm(true);
  };

  const handleSaveEditWarmup = e => {
    e.preventDefault();
    setWarmupMovements(warmupMovements.map((m, idx) => idx === editWarmupIdx ? newWarmup : m));
    setEditWarmupIdx(null);
    setNewWarmup({ title: '', reps: '', description: '', note: '' });
    setShowWarmupForm(false);
  };

  const handleDeleteWarmup = idx => {
    setWarmupMovements(warmupMovements.filter((_, i) => i !== idx));
    if (editWarmupIdx === idx) {
      setEditWarmupIdx(null);
      setShowWarmupForm(false);
      setNewWarmup({ title: '', reps: '', description: '', note: '' });
    }
  };

  const handleWorkoutChange = e => {
    setNewWorkoutMovement({ ...newWorkoutMovement, [e.target.name]: e.target.value });
  };

  const handleAddWorkoutMovement = e => {
    e.preventDefault();
    setWorkoutMovements([...workoutMovements, newWorkoutMovement]);
    setNewWorkoutMovement({ title: '', reps: '', description: '', note: '' });
    setShowWorkoutForm(false);
  };

  const handleEditWorkout = idx => {
    setEditWorkoutIdx(idx);
    setNewWorkoutMovement(workoutMovements[idx]);
    setShowWorkoutForm(true);
  };

  const handleSaveEditWorkout = e => {
    e.preventDefault();
    setWorkoutMovements(workoutMovements.map((m, idx) => idx === editWorkoutIdx ? newWorkoutMovement : m));
    setEditWorkoutIdx(null);
    setNewWorkoutMovement({ title: '', reps: '', description: '', note: '' });
    setShowWorkoutForm(false);
  };

  const handleDeleteWorkout = idx => {
    setWorkoutMovements(workoutMovements.filter((_, i) => i !== idx));
    if (editWorkoutIdx === idx) {
      setEditWorkoutIdx(null);
      setShowWorkoutForm(false);
      setNewWorkoutMovement({ title: '', reps: '', description: '', note: '' });
    }
  };

  const handleStretchingChange = e => {
    setNewStretchingMovement({ ...newStretchingMovement, [e.target.name]: e.target.value });
  };

  const handleAddStretchingMovement = e => {
    e.preventDefault();
    setStretchingMovements([...stretchingMovements, newStretchingMovement]);
    setNewStretchingMovement({ title: '', reps: '', description: '', note: '' });
    setShowStretchingForm(false);
  };

  const handleEditStretching = idx => {
    setEditStretchingIdx(idx);
    setNewStretchingMovement(stretchingMovements[idx]);
    setShowStretchingForm(true);
  };

  const handleSaveEditStretching = e => {
    e.preventDefault();
    setStretchingMovements(stretchingMovements.map((m, idx) => idx === editStretchingIdx ? newStretchingMovement : m));
    setEditStretchingIdx(null);
    setNewStretchingMovement({ title: '', reps: '', description: '', note: '' });
    setShowStretchingForm(false);
  };

  const handleDeleteStretching = idx => {
    setStretchingMovements(stretchingMovements.filter((_, i) => i !== idx));
    if (editStretchingIdx === idx) {
      setEditStretchingIdx(null);
      setShowStretchingForm(false);
      setNewStretchingMovement({ title: '', reps: '', description: '', note: '' });
    }
  };

  const handleChallengeChange = e => {
    setNewChallengeMovement({ ...newChallengeMovement, [e.target.name]: e.target.value });
  };

  const handleAddChallengeMovement = e => {
    e.preventDefault();
    setChallengeMovements([...challengeMovements, newChallengeMovement]);
    setNewChallengeMovement({ title: '', reps: '', description: '', note: '' });
    setShowChallengeForm(false);
  };

  const handleEditChallenge = idx => {
    setEditChallengeIdx(idx);
    setNewChallengeMovement(challengeMovements[idx]);
    setShowChallengeForm(true);
  };

  const handleSaveEditChallenge = e => {
    e.preventDefault();
    setChallengeMovements(challengeMovements.map((m, idx) => idx === editChallengeIdx ? newChallengeMovement : m));
    setEditChallengeIdx(null);
    setNewChallengeMovement({ title: '', reps: '', description: '', note: '' });
    setShowChallengeForm(false);
  };

  const handleDeleteChallenge = idx => {
    setChallengeMovements(challengeMovements.filter((_, i) => i !== idx));
    if (editChallengeIdx === idx) {
      setEditChallengeIdx(null);
      setShowChallengeForm(false);
      setNewChallengeMovement({ title: '', reps: '', description: '', note: '' });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const workouts = getWorkoutsFromStorage();
    const workoutData = {
      id: id || (Date.now() + ''),
      title: form.title,
      category: form.category,
      warmupMovements,
      workoutMovements,
      stretchingMovements,
      challengeMovements,
      author: username,
      dateCreated: id ? (workouts.find(w => w.id === id)?.dateCreated || new Date().toISOString()) : new Date().toISOString(),
    };
    let newWorkouts;
    if (id) {
      newWorkouts = workouts.map(w => w.id === id ? workoutData : w);
    } else {
      newWorkouts = [...workouts, workoutData];
    }
    saveWorkoutsToStorage(newWorkouts);
    alert('Workout saved!');
    navigate('/coach');
  };

  return (
    <div className="dashboard-container">
      <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: 8, maxWidth: 700, margin: '2rem auto' }}>
        <h2 style={{ fontWeight: 700, marginBottom: 24 }}>Create New Workout</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{ width: '100%', padding: 8 }}
              required
            >
              <option value="">Select a Category</option>
              {/* TODO: Populate with real categories */}
              <option value="balance-fall-prevention">Balance & Fall Prevention</option>
              <option value="joint-pain-arthritis">Joint Pain & Arthritis</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          {/* Warm Up Section */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Warm Up Section</label>
            {warmupMovements.length > 0 && (
              <ul style={{ marginBottom: 12 }}>
                {warmupMovements.map((m, idx) => (
                  <li key={idx} style={{ background: '#fff', borderRadius: 6, padding: '10px 12px', marginBottom: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', position: 'relative' }}>
                    <strong>{m.title}</strong> {m.reps && <span style={{ color: '#007bff', marginLeft: 8 }}>{m.reps}</span>}
                    {m.description && <div style={{ color: '#555', marginTop: 2 }}>{m.description}</div>}
                    {m.note && <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}><em>Note: {m.note}</em></div>}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => handleEditWarmup(idx)} style={{ padding: '2px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Edit</button>
                      <button type="button" onClick={() => handleDeleteWarmup(idx)} style={{ padding: '2px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {showWarmupForm ? (
              <div style={{ background: '#e9ecef', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                <input
                  type="text"
                  name="title"
                  value={newWarmup.title}
                  onChange={handleWarmupChange}
                  placeholder="Movement Title"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                  required
                />
                <input
                  type="text"
                  name="reps"
                  value={newWarmup.reps}
                  onChange={handleWarmupChange}
                  placeholder="Rep Scheme (e.g., 2x10)"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                />
                <textarea
                  name="description"
                  value={newWarmup.description}
                  onChange={handleWarmupChange}
                  placeholder="Description"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 40, resize: 'vertical' }}
                />
                <textarea
                  name="note"
                  value={newWarmup.note}
                  onChange={handleWarmupChange}
                  placeholder="Note"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 30, resize: 'vertical' }}
                />
                {editWarmupIdx !== null ? (
                  <>
                    <button type="button" onClick={handleSaveEditWarmup} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Save</button>
                    <button type="button" onClick={() => { setEditWarmupIdx(null); setShowWarmupForm(false); setNewWarmup({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={handleAddWarmup} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Add</button>
                    <button type="button" onClick={() => setShowWarmupForm(false)} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                )}
              </div>
            ) : (
              <button type="button" onClick={() => { setShowWarmupForm(true); setEditWarmupIdx(null); setNewWarmup({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '4px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 18 }}>+
              </button>
            )}
          </div>
          {/* Workout Section */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Workout Section</label>
            {workoutMovements.length > 0 && (
              <ul style={{ marginBottom: 12 }}>
                {workoutMovements.map((m, idx) => (
                  <li key={idx} style={{ background: '#fff', borderRadius: 6, padding: '10px 12px', marginBottom: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', position: 'relative' }}>
                    <strong>{m.title}</strong> {m.reps && <span style={{ color: '#007bff', marginLeft: 8 }}>{m.reps}</span>}
                    {m.description && <div style={{ color: '#555', marginTop: 2 }}>{m.description}</div>}
                    {m.note && <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}><em>Note: {m.note}</em></div>}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => handleEditWorkout(idx)} style={{ padding: '2px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Edit</button>
                      <button type="button" onClick={() => handleDeleteWorkout(idx)} style={{ padding: '2px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {showWorkoutForm ? (
              <div style={{ background: '#e9ecef', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                <input
                  type="text"
                  name="title"
                  value={newWorkoutMovement.title}
                  onChange={handleWorkoutChange}
                  placeholder="Movement Title"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                  required
                />
                <input
                  type="text"
                  name="reps"
                  value={newWorkoutMovement.reps}
                  onChange={handleWorkoutChange}
                  placeholder="Rep Scheme (e.g., 2x10)"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                />
                <textarea
                  name="description"
                  value={newWorkoutMovement.description}
                  onChange={handleWorkoutChange}
                  placeholder="Description"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 40, resize: 'vertical' }}
                />
                <textarea
                  name="note"
                  value={newWorkoutMovement.note}
                  onChange={handleWorkoutChange}
                  placeholder="Note"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 30, resize: 'vertical' }}
                />
                {editWorkoutIdx !== null ? (
                  <>
                    <button type="button" onClick={handleSaveEditWorkout} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Save</button>
                    <button type="button" onClick={() => { setEditWorkoutIdx(null); setShowWorkoutForm(false); setNewWorkoutMovement({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={handleAddWorkoutMovement} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Add</button>
                    <button type="button" onClick={() => setShowWorkoutForm(false)} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                )}
              </div>
            ) : (
              <button type="button" onClick={() => { setShowWorkoutForm(true); setEditWorkoutIdx(null); setNewWorkoutMovement({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '4px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 18 }}>+
              </button>
            )}
          </div>
          {/* Stretching Section */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Stretching Section</label>
            {stretchingMovements.length > 0 && (
              <ul style={{ marginBottom: 12 }}>
                {stretchingMovements.map((m, idx) => (
                  <li key={idx} style={{ background: '#fff', borderRadius: 6, padding: '10px 12px', marginBottom: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', position: 'relative' }}>
                    <strong>{m.title}</strong> {m.reps && <span style={{ color: '#007bff', marginLeft: 8 }}>{m.reps}</span>}
                    {m.description && <div style={{ color: '#555', marginTop: 2 }}>{m.description}</div>}
                    {m.note && <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}><em>Note: {m.note}</em></div>}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => handleEditStretching(idx)} style={{ padding: '2px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Edit</button>
                      <button type="button" onClick={() => handleDeleteStretching(idx)} style={{ padding: '2px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {showStretchingForm ? (
              <div style={{ background: '#e9ecef', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                <input
                  type="text"
                  name="title"
                  value={newStretchingMovement.title}
                  onChange={handleStretchingChange}
                  placeholder="Movement Title"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                  required
                />
                <input
                  type="text"
                  name="reps"
                  value={newStretchingMovement.reps}
                  onChange={handleStretchingChange}
                  placeholder="Rep Scheme (e.g., 2x10)"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                />
                <textarea
                  name="description"
                  value={newStretchingMovement.description}
                  onChange={handleStretchingChange}
                  placeholder="Description"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 40, resize: 'vertical' }}
                />
                <textarea
                  name="note"
                  value={newStretchingMovement.note}
                  onChange={handleStretchingChange}
                  placeholder="Note"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 30, resize: 'vertical' }}
                />
                {editStretchingIdx !== null ? (
                  <>
                    <button type="button" onClick={handleSaveEditStretching} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Save</button>
                    <button type="button" onClick={() => { setEditStretchingIdx(null); setShowStretchingForm(false); setNewStretchingMovement({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={handleAddStretchingMovement} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Add</button>
                    <button type="button" onClick={() => setShowStretchingForm(false)} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                )}
              </div>
            ) : (
              <button type="button" onClick={() => { setShowStretchingForm(true); setEditStretchingIdx(null); setNewStretchingMovement({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '4px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 18 }}>+
              </button>
            )}
          </div>
          {/* Challenge Section */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Challenge Section</label>
            {challengeMovements.length > 0 && (
              <ul style={{ marginBottom: 12 }}>
                {challengeMovements.map((m, idx) => (
                  <li key={idx} style={{ background: '#fff', borderRadius: 6, padding: '10px 12px', marginBottom: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', position: 'relative' }}>
                    <strong>{m.title}</strong> {m.reps && <span style={{ color: '#007bff', marginLeft: 8 }}>{m.reps}</span>}
                    {m.description && <div style={{ color: '#555', marginTop: 2 }}>{m.description}</div>}
                    {m.note && <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}><em>Note: {m.note}</em></div>}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => handleEditChallenge(idx)} style={{ padding: '2px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Edit</button>
                      <button type="button" onClick={() => handleDeleteChallenge(idx)} style={{ padding: '2px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {showChallengeForm ? (
              <div style={{ background: '#e9ecef', padding: 12, borderRadius: 6, marginBottom: 8 }}>
                <input
                  type="text"
                  name="title"
                  value={newChallengeMovement.title}
                  onChange={handleChallengeChange}
                  placeholder="Movement Title"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                  required
                />
                <input
                  type="text"
                  name="reps"
                  value={newChallengeMovement.reps}
                  onChange={handleChallengeChange}
                  placeholder="Rep Scheme (e.g., 2x10)"
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                />
                <textarea
                  name="description"
                  value={newChallengeMovement.description}
                  onChange={handleChallengeChange}
                  placeholder="Description"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 40, resize: 'vertical' }}
                />
                <textarea
                  name="note"
                  value={newChallengeMovement.note}
                  onChange={handleChallengeChange}
                  placeholder="Note"
                  style={{ width: '100%', padding: 8, marginBottom: 8, minHeight: 30, resize: 'vertical' }}
                />
                {editChallengeIdx !== null ? (
                  <>
                    <button type="button" onClick={handleSaveEditChallenge} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Save</button>
                    <button type="button" onClick={() => { setEditChallengeIdx(null); setShowChallengeForm(false); setNewChallengeMovement({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={handleAddChallengeMovement} style={{ padding: '6px 14px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, marginRight: 8 }}>Add</button>
                    <button type="button" onClick={() => setShowChallengeForm(false)} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </>
                )}
              </div>
            ) : (
              <button type="button" onClick={() => { setShowChallengeForm(true); setEditChallengeIdx(null); setNewChallengeMovement({ title: '', reps: '', description: '', note: '' }); }} style={{ padding: '4px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 18 }}>+
              </button>
            )}
          </div>
          <button type="submit" style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Create Workout
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkout; 