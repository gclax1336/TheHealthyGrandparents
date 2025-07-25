import React, { useState, useEffect } from 'react';
import { workoutPrograms as initialPrograms } from '../data/workoutPrograms';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CoachDashboard = () => {
  const { username } = useAuth();
  const [activeSection, setActiveSection] = useState('welcome');
  const [programs, setPrograms] = useState(initialPrograms);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ category: '', description: '' });
  const [newProgram, setNewProgram] = useState({ category: '', description: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [expanded, setExpanded] = useState({}); // Track expanded programs
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedDays, setExpandedDays] = useState({});

  // For editing/adding days and exercises
  const [dayEdit, setDayEdit] = useState({}); // { [programId]: { [dayIdx]: { title, exercises, editing } } }
  const [exerciseEdit, setExerciseEdit] = useState({}); // { [programId]: { [dayIdx]: { [exIdx]: { name, details, editing } } } }
  const [newDay, setNewDay] = useState({}); // { [programId]: { title: '' } }
  const [newExercise, setNewExercise] = useState({}); // { [programId]: { [dayIdx]: { name: '', details: '' } } }

  // Placeholder for member management
  const [members, setMembers] = useState([]);

  // Mock data for demonstration (replace with real data source as needed)
  const [workouts, setWorkouts] = useState([
    { id: 'w1', title: 'Balance Builder', dateCreated: '2024-06-01', author: 'Coach Grant', categoryId: null },
    { id: 'w2', title: 'Strength Foundation', dateCreated: '2024-06-02', author: 'Coach Sam', categoryId: 'balance-fall-prevention' },
    { id: 'w3', title: 'Cardio Blast', dateCreated: '2024-06-03', author: 'Coach Grant', categoryId: null },
    { id: 'w4', title: 'Flexibility Flow', dateCreated: '2024-06-04', author: 'Coach Sam', categoryId: 'joint-pain-arthritis' },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(stored);
  }, []);

  // Program edit handlers
  const startEdit = (program) => {
    setEditingId(program.id);
    setEditData({ category: program.category, description: program.description });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ category: '', description: '' });
  };
  const saveEdit = (id) => {
    setPrograms(programs.map(p => p.id === id ? { ...p, ...editData } : p));
    cancelEdit();
  };

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setPrograms(programs.filter(p => p.id !== id));
      if (selectedCategory === id) {
        setSelectedCategory('');
      }
    }
  };

  // Expand/collapse program
  const toggleExpand = (id) => {
    setExpanded(exp => ({ ...exp, [id]: !exp[id] }));
  };

  // Day handlers
  const handleDayEdit = (programId, dayIdx, field, value) => {
    setDayEdit(prev => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        [dayIdx]: { ...prev[programId][dayIdx], [field]: value }
      }
    }));
  };
  const startDayEdit = (programId, dayIdx, title, exercises) => {
    setDayEdit(prev => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        [dayIdx]: {
          title,
          exercises: exercises.map(ensureCoachNote),
          editing: true
        }
      }
    }));
  };
  const saveDayEdit = (programId, dayIdx) => {
    setPrograms(programs => programs.map(p =>
      p.id === programId
        ? {
            ...p,
            days: p.days.map((d, i) =>
              i === dayIdx ? { ...d, title: dayEdit[programId][dayIdx].title, exercises: dayEdit[programId][dayIdx].exercises } : d
            )
          }
        : p
    ));
    setDayEdit(prev => ({
      ...prev,
      [programId]: { ...prev[programId], [dayIdx]: undefined }
    }));
  };
  const cancelDayEdit = (programId, dayIdx) => {
    setDayEdit(prev => ({
      ...prev,
      [programId]: { ...prev[programId], [dayIdx]: undefined }
    }));
  };
  const handleNewDay = (programId, value) => {
    setNewDay(prev => ({ ...prev, [programId]: { title: value } }));
  };
  const addDay = (programId) => {
    if (!newDay[programId]?.title?.trim()) return;
    setPrograms(programs => programs.map(p =>
      p.id === programId
        ? { ...p, days: [...p.days, { title: newDay[programId].title, exercises: [] }] }
        : p
    ));
    setNewDay(prev => ({ ...prev, [programId]: { title: '' } }));
  };

  // Exercise handlers
  const handleExerciseEdit = (programId, dayIdx, exIdx, field, value) => {
    setDayEdit(prev => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        [dayIdx]: {
          ...prev[programId][dayIdx],
          exercises: prev[programId][dayIdx].exercises.map((ex, i) =>
            i === exIdx ? { ...ex, [field]: value } : ex
          )
        }
      }
    }));
  };
  const startExerciseEdit = (programId, dayIdx, exIdx, name, details) => {
    setExerciseEdit(prev => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        [dayIdx]: {
          ...((prev[programId] && prev[programId][dayIdx]) || {}),
          [exIdx]: { name, details, editing: true },
        },
      },
    }));
  };
  const saveExerciseEdit = (programId, dayIdx, exIdx) => {
    setPrograms(programs => programs.map(p =>
      p.id === programId
        ? {
            ...p,
            days: p.days.map((d, i) =>
              i === dayIdx
                ? {
                    ...d,
                    exercises: d.exercises.map((ex, j) =>
                      j === exIdx ? { ...ex, ...exerciseEdit[programId][dayIdx][exIdx] } : ex
                    ),
                  }
                : d
            ),
          }
        : p
    ));
    setExerciseEdit(prev => ({ ...prev, [programId]: { ...prev[programId], [dayIdx]: { ...prev[programId][dayIdx], [exIdx]: undefined } } }));
  };
  const deleteExercise = (programId, dayIdx, exIdx) => {
    setPrograms(programs => programs.map(p =>
      p.id === programId
        ? {
            ...p,
            days: p.days.map((d, i) =>
              i === dayIdx
                ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) }
                : d
            ),
          }
        : p
    ));
  };
  const handleNewExercise = (programId, dayIdx, field, value) => {
    setNewExercise(prev => ({
      ...prev,
      [programId]: {
        ...prev[programId],
        [dayIdx]: {
          ...((prev[programId] && prev[programId][dayIdx]) || {}),
          [field]: value,
        },
      },
    }));
  };
  const addExercise = (programId, dayIdx) => {
    const ex = newExercise[programId]?.[dayIdx];
    if (!ex?.name?.trim()) return;
    setPrograms(programs => programs.map(p =>
      p.id === programId
        ? {
            ...p,
            days: p.days.map((d, i) =>
              i === dayIdx
                ? { ...d, exercises: [...d.exercises, { name: ex.name, details: ex.details }] }
                : d
            ),
          }
        : p
    ));
    setNewExercise(prev => ({ ...prev, [programId]: { ...prev[programId], [dayIdx]: { name: '', details: '' } } }));
  };

  // Add new program
  const addProgram = (e) => {
    e.preventDefault();
    if (!newProgram.category.trim()) return;
    setPrograms([
      ...programs,
      {
        id: newProgram.category.toLowerCase().replace(/\s+/g, '-'),
        category: newProgram.category,
        description: newProgram.description,
        days: [],
      },
    ]);
    setNewProgram({ category: '', description: '' });
  };

  // Add coachNote to exercises if not present
  const ensureCoachNote = (ex) => ({ ...ex, coachNote: ex.coachNote || '' });

  const EditWorkoutsSection = () => {
    const toggleCategory = (categoryId) => {
      setExpanded(prev => ({
        ...prev,
        [categoryId]: !prev[categoryId]
      }));
    };
    const toggleDay = (categoryId, dayIndex) => {
      setExpandedDays(prev => ({
        ...prev,
        [`${categoryId}-${dayIndex}`]: !prev[`${categoryId}-${dayIndex}`]
      }));
    };

    const [newWorkout, setNewWorkout] = useState({
      category: '',
      dayTitle: '',
      exerciseName: '',
      exerciseDetails: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Add workout logic here
      setNewWorkout({
        category: '',
        dayTitle: '',
        exerciseName: '',
        exerciseDetails: ''
      });
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2>Edit Workouts</h2>
          <button
            onClick={() => navigate('/coach/create-workout')}
            style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
          >
            Create New Workout
          </button>
        </div>

        {/* Existing Workouts List */}
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 8, marginBottom: 24 }}>
          {programs.map((program) => (
            <div key={program.id}>
              {/* Category Row (no edit/delete) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#fff',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  marginBottom: expanded[program.id] ? 0 : '1rem',
                  borderRadius: expanded[program.id] ? '8px 8px 0 0' : '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onClick={() => toggleCategory(program.id)}
              >
                <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: expanded[program.id] ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', marginLeft: 12 }}>{program.category}</span>
              </div>
              {/* Workout Day Titles */}
              {expanded[program.id] && (
                <div style={{ background: '#f8f9fa', padding: '1rem', borderBottom: '1px solid #eee', borderRadius: '0 0 8px 8px', marginBottom: '1rem' }}>
                  {program.days.map((day, dayIndex) => (
                    <div key={dayIndex}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#fff',
                          padding: '0.75rem 1rem',
                          marginBottom: 6,
                          borderRadius: 6,
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                        }}
                        onClick={() => toggleDay(program.id, dayIndex)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1rem', transition: 'transform 0.2s', transform: expandedDays[`${program.id}-${dayIndex}`] ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                          {dayEdit[program.id]?.[dayIndex]?.editing ? (
                            <input
                              type="text"
                              value={dayEdit[program.id][dayIndex].title}
                              onChange={e => handleDayEdit(program.id, dayIndex, 'title', e.target.value)}
                              style={{ fontWeight: 500, fontSize: 16, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
                              onClick={e => e.stopPropagation()}
                            />
                          ) : (
                            <span style={{ fontWeight: 500 }}>{day.title}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {dayEdit[program.id]?.[dayIndex]?.editing ? (
                            <>
                              <button
                                onClick={e => { e.stopPropagation(); saveDayEdit(program.id, dayIndex); }}
                                style={{ padding: '4px 10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                              >Save</button>
                              <button
                                onClick={e => { e.stopPropagation(); cancelDayEdit(program.id, dayIndex); }}
                                style={{ padding: '4px 10px', background: '#888', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                              >Cancel</button>
                            </>
                          ) : (
                            <button
                              onClick={e => { e.stopPropagation(); navigate(`/coach/edit-workout/${program.id}`); }}
                              style={{ padding: '4px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                            >Edit</button>
                          )}
                        </div>
                      </div>
                      {/* Exercises (expandable) */}
                      {expandedDays[`${program.id}-${dayIndex}`] && (
                        <div style={{ marginLeft: 36, marginTop: 8, marginBottom: 12 }}>
                          {dayEdit[program.id]?.[dayIndex]?.editing ? (
                            <div style={{ background: '#f4f8fa', padding: 16, borderRadius: 8, marginBottom: 12 }}>
                              {dayEdit[program.id][dayIndex].exercises.map((ex, exIndex) => (
                                <div key={exIndex} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                                  <input
                                    type="text"
                                    value={ex.name}
                                    onChange={e => handleExerciseEdit(program.id, dayIndex, exIndex, 'name', e.target.value)}
                                    placeholder="Exercise Name"
                                    style={{ width: 180, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
                                  />
                                  <input
                                    type="text"
                                    value={ex.details}
                                    onChange={e => handleExerciseEdit(program.id, dayIndex, exIndex, 'details', e.target.value)}
                                    placeholder="Reps/Details"
                                    style={{ width: 120, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
                                  />
                                  <textarea
                                    value={ex.coachNote}
                                    onChange={e => handleExerciseEdit(program.id, dayIndex, exIndex, 'coachNote', e.target.value)}
                                    placeholder="Coach's Note (cues, tips, etc.)"
                                    style={{ width: 220, minHeight: 40, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }}
                                  />
                                  <button
                                    onClick={e => { e.stopPropagation(); deleteExercise(program.id, dayIndex, exIndex); }}
                                    style={{ padding: '4px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                                  >Remove</button>
                                </div>
                              ))}
                              <button
                                onClick={e => { e.stopPropagation(); addExerciseToDay(program.id, dayIndex); }}
                                style={{ padding: '4px 12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 15, marginTop: 8 }}
                              >+ Add Exercise</button>
                            </div>
                          ) : (
                            day.exercises.map((exercise, exIndex) => (
                              <div
                                key={exIndex}
                                style={{ padding: '8px 12px', background: '#f8f9fa', borderRadius: 4, marginBottom: 8, fontSize: 15 }}
                              >
                                <strong>{exercise.name}</strong>
                                {exercise.details && (
                                  <span style={{ color: '#666', marginLeft: 8 }}>– {exercise.details}</span>
                                )}
                                {exercise.coachNote && (
                                  <div style={{ color: '#888', fontSize: 13, marginTop: 2, marginLeft: 2 }}><em>Coach: {exercise.coachNote}</em></div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CreateWorkoutSection = () => {
    const [newWorkout, setNewWorkout] = useState({
      category: '',
      dayTitle: '',
      exerciseName: '',
      exerciseDetails: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Add workout logic here
      setNewWorkout({
        category: '',
        dayTitle: '',
        exerciseName: '',
        exerciseDetails: ''
      });
    };

    return (
      <div>
        <h2>Create New Workout</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Category</label>
            <select
              value={newWorkout.category}
              onChange={e => setNewWorkout({ ...newWorkout, category: e.target.value })}
              style={{ width: '100%', padding: 8 }}
              required
            >
              <option value="">Select a Category</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>{program.category}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Day Title</label>
            <input
              type="text"
              value={newWorkout.dayTitle}
              onChange={e => setNewWorkout({ ...newWorkout, dayTitle: e.target.value })}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Exercise Name</label>
            <input
              type="text"
              value={newWorkout.exerciseName}
              onChange={e => setNewWorkout({ ...newWorkout, exerciseName: e.target.value })}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Exercise Details</label>
            <input
              type="text"
              value={newWorkout.exerciseDetails}
              onChange={e => setNewWorkout({ ...newWorkout, exerciseDetails: e.target.value })}
              style={{ width: '100%', padding: 8 }}
              placeholder="e.g., 3 sets of 12 reps"
            />
          </div>

          <button type="submit" style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Create Workout
          </button>
        </form>
      </div>
    );
  };

  const ViewMembersSection = () => {
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMember, setNewMember] = useState({ username: '', email: '', role: 'member' });
    const [editIdx, setEditIdx] = useState(null);
    const [editRole, setEditRole] = useState('member');

    // Helper to reload members from localStorage
    const reloadMembers = () => {
      const stored = JSON.parse(localStorage.getItem('members') || '[]');
      setMembers(stored);
    };

    // Load members on mount and when showAddModal closes
    useEffect(() => {
      reloadMembers();
    }, [showAddModal]);

    // Save members to localStorage whenever they change
    useEffect(() => {
      localStorage.setItem('members', JSON.stringify(members));
    }, [members]);

    const filteredMembers = members.filter(m =>
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase())
    );

    // Add member
    const handleAddMember = (e) => {
      e.preventDefault();
      if (!newMember.username.trim() || !newMember.email.trim()) return;
      setMembers(prev => [
        ...prev,
        {
          username: newMember.username,
          email: newMember.email,
          role: newMember.role,
          lastLogin: null
        }
      ]);
      setShowAddModal(false);
      setNewMember({ username: '', email: '', role: 'member' });
      setTimeout(reloadMembers, 100); // Ensure reload after modal closes
    };

    // Delete member
    const handleDelete = (idx) => {
      if (window.confirm('Are you sure you want to delete this member?')) {
        const updated = members.filter((_, i) => i !== idx);
        setMembers(updated);
        setTimeout(reloadMembers, 100);
      }
    };

    // Start editing role
    const startEditRole = (idx, role) => {
      setEditIdx(idx);
      setEditRole(role);
    };
    // Save edited role
    const saveEditRole = (idx) => {
      setMembers(prev => prev.map((m, i) => i === idx ? { ...m, role: editRole } : m));
      setEditIdx(null);
      setTimeout(reloadMembers, 100);
    };
    // Cancel editing role
    const cancelEditRole = () => setEditIdx(null);

    return (
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2>Members</h2>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
          >+ Add Member</button>
        </div>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 6,
            border: '1px solid #ccc',
            marginBottom: 24,
            fontSize: 16
          }}
        />
        <div style={{ background: '#f8f9fa', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', padding: 0 }}>
          {filteredMembers.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>No members found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e9ecef' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Username</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Last Login</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f4f8fa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{m.username}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{m.email || <span style={{ color: '#bbb' }}>No email</span>}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>
                      {editIdx === i ? (
                        <>
                          <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #ccc' }}>
                            <option value="owner">Owner</option>
                            <option value="coach">Coach</option>
                            <option value="member">Member</option>
                          </select>
                          <button onClick={() => saveEditRole(i)} style={{ marginLeft: 8, padding: '4px 10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Save</button>
                          <button onClick={cancelEditRole} style={{ marginLeft: 4, padding: '4px 10px', background: '#888', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <span style={{ textTransform: 'capitalize' }}>{m.role}</span>
                          <button onClick={() => startEditRole(i, m.role)} style={{ marginLeft: 8, padding: '4px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Edit</button>
                        </>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{m.lastLogin ? new Date(m.lastLogin).toLocaleString() : <span style={{ color: '#bbb' }}>Never</span>}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(i)} style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Add Member Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: 8,
              width: '100%',
              maxWidth: 400,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ marginBottom: 24, fontSize: '1.3rem' }}>Add New Member</h3>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6 }}>Username</label>
                  <input
                    type="text"
                    value={newMember.username}
                    onChange={e => setNewMember({ ...newMember, username: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6 }}>Role</label>
                  <select
                    value={newMember.role}
                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
                  >
                    <option value="owner">Owner</option>
                    <option value="coach">Coach</option>
                    <option value="member">Member</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >Cancel</button>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add these helper functions if not already present:
  const addExerciseToDay = (programId, dayIdx) => {
    setDayEdit(prev => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        [dayIdx]: {
          ...prev[programId][dayIdx],
          exercises: [
            ...prev[programId][dayIdx].exercises,
            { name: '', details: '', coachNote: '' }
          ]
        }
      }
    }));
  };
  const removeExerciseFromDay = (programId, dayIdx, exIdx) => {
    setDayEdit(prev => ({
      ...prev,
      [programId]: {
        ...(prev[programId] || {}),
        [dayIdx]: {
          ...prev[programId][dayIdx],
          exercises: prev[programId][dayIdx].exercises.filter((_, i) => i !== exIdx)
        }
      }
    }));
  };

  // Add stubs for missing section components if not present:
  const EditCategoriesSection = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Edit Categories</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            padding: '8px 16px', 
            background: '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Add Category
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {programs.map(program => (
          <li key={program.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
            {editingId === program.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#666', fontSize: '1.1rem' }}>Category Name</label>
                  <input
                    type="text"
                    value={editData.category}
                    onChange={e => setEditData({ ...editData, category: e.target.value })}
                    style={{ 
                      fontWeight: 600, 
                      fontSize: '1.1rem', 
                      padding: '12px 16px', 
                      width: '100%',
                      maxWidth: 500,
                      borderRadius: 6,
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#666', fontSize: '1.1rem' }}>Description</label>
                  <textarea
                    value={editData.description}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                    style={{ 
                      width: '100%',
                      maxWidth: 800,
                      padding: '12px 16px',
                      minHeight: 120,
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => saveEdit(program.id)} 
                    style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={cancelEdit}
                    style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{program.category}</span>
                <div>
                  <button 
                    onClick={() => startEdit(program)} 
                    style={{ marginRight: 8, padding: '6px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteCategory(program.id)} 
                    style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Add Category Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: 8,
            width: '100%',
            maxWidth: 800,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: 24, fontSize: '1.5rem' }}>Add New Category</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              addProgram(e);
              setShowAddModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#666', fontSize: '1.1rem' }}>Category Name</label>
                <input
                  type="text"
                  value={newProgram.category}
                  onChange={e => setNewProgram({ ...newProgram, category: e.target.value })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    fontSize: '1.1rem',
                    borderRadius: 6,
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#666', fontSize: '1.1rem' }}>Description</label>
                <textarea
                  value={newProgram.description}
                  onChange={e => setNewProgram({ ...newProgram, description: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    minHeight: 120,
                    fontSize: '1rem',
                    borderRadius: 6,
                    border: '1px solid #ddd',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  const WelcomeSection = () => <div></div>;

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortField === 'dateCreated') {
      return sortDirection === 'asc'
        ? new Date(a.dateCreated) - new Date(b.dateCreated)
        : new Date(b.dateCreated) - new Date(a.dateCreated);
    } else if (sortField === 'author') {
      return sortDirection === 'asc'
        ? a.author.localeCompare(b.author)
        : b.author.localeCompare(a.author);
    } else {
      return 0;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get categories for dropdown
  const categories = programs.map(p => ({ id: p.id, name: p.category }));

  // Edit state for Workout Archive
  const [archiveEditingId, setArchiveEditingId] = useState(null);
  const [archiveEditData, setArchiveEditData] = useState({ title: '', author: '' });

  const startArchiveEdit = (workout) => {
    setArchiveEditingId(workout.id);
    setArchiveEditData({ title: workout.title, author: workout.author });
  };
  const saveArchiveEdit = (id) => {
    setWorkouts(ws => ws.map(w => w.id === id ? { ...w, ...archiveEditData } : w));
    setArchiveEditingId(null);
    setArchiveEditData({ title: '', author: '' });
  };
  const cancelArchiveEdit = () => {
    setArchiveEditingId(null);
    setArchiveEditData({ title: '', author: '' });
  };

  // Add these functions for the Workout Archive section
  const assignCategory = (id, categoryId) => {
    setWorkouts(ws => ws.map(w => w.id === id ? { ...w, categoryId: categoryId || null } : w));
  };
  const deleteWorkout = (id) => {
    if (window.confirm('Delete this workout?')) {
      setWorkouts(ws => ws.filter(w => w.id !== id));
    }
  };

  const WorkoutArchiveSection = () => (
    <div>
      <h2>Workout Archive (Coach Only)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('title')}>Title</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('dateCreated')}>
              Date Created {sortField === 'dateCreated' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th style={{ textAlign: 'left', padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('author')}>
              Author {sortField === 'author' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th style={{ textAlign: 'left', padding: '12px 16px' }}>Published</th>
            <th style={{ textAlign: 'left', padding: '12px 16px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedWorkouts.map((w) => (
            <tr key={w.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                {archiveEditingId === w.id ? (
                  <input 
                    value={archiveEditData.title} 
                    onChange={e => setArchiveEditData({ ...archiveEditData, title: e.target.value })}
                    style={{ width: '100%', fontWeight: 500, fontSize: 16, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
                  />
                ) : (
                  w.title
                )}
              </td>
              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{w.dateCreated}</td>
              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                {archiveEditingId === w.id ? (
                  <input 
                    value={archiveEditData.author} 
                    onChange={e => setArchiveEditData({ ...archiveEditData, author: e.target.value })}
                    style={{ width: '100%', fontWeight: 500, fontSize: 16, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
                  />
                ) : (
                  w.author
                )}
              </td>
              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                <input
                  type="checkbox"
                  checked={!!(w.categoryId)}
                  onChange={e => assignCategory(w.id, e.target.checked ? 'published' : null)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
              </td>
              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                {archiveEditingId === w.id ? (
                  <>
                    <button onClick={() => saveArchiveEdit(w.id)} style={{ marginRight: 8, padding: '8px 16px', borderRadius: 6, border: 'none', background: '#27ae60', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={cancelArchiveEdit} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#e74c3c', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate(`/coach/edit-workout/${w.id}`)} style={{ marginRight: 8, padding: '8px 16px', borderRadius: 6, border: 'none', background: '#3498db', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteWorkout(w.id)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#e74c3c', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- Layout ---
  return (
    <div style={{ display: 'flex', minHeight: 500, maxWidth: 1100, margin: '2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: '1px solid #eee', padding: '2rem 1rem', background: '#f8f9fa', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
        <button onClick={() => setActiveSection('edit-categories')} style={{ display: 'block', width: '100%', marginBottom: 16, padding: '0.75rem', background: activeSection === 'edit-categories' ? '#27ae60' : '#fff', color: activeSection === 'edit-categories' ? '#fff' : '#222', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Categories</button>
        <button onClick={() => setActiveSection('edit')} style={{ display: 'block', width: '100%', marginBottom: 16, padding: '0.75rem', background: activeSection === 'edit' ? '#27ae60' : '#fff', color: activeSection === 'edit' ? '#fff' : '#222', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Workouts</button>
        <button onClick={() => setActiveSection('workout-archive')} style={{ display: 'block', width: '100%', marginBottom: 16, padding: '0.75rem', background: activeSection === 'workout-archive' ? '#27ae60' : '#fff', color: activeSection === 'workout-archive' ? '#fff' : '#222', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Workout Archive</button>
        <button onClick={() => setActiveSection('members')} style={{ display: 'block', width: '100%', marginBottom: 16, padding: '0.75rem', background: activeSection === 'members' ? '#27ae60' : '#fff', color: activeSection === 'members' ? '#fff' : '#222', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>View Members</button>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem 2.5rem' }}>
        {activeSection === 'edit-categories' && <EditCategoriesSection />}
        {activeSection === 'edit' && <EditWorkoutsSection />}
        {activeSection === 'workout-archive' && <WorkoutArchiveSection />}
        {activeSection === 'members' && <ViewMembersSection />}
        {activeSection === 'welcome' && <WelcomeSection />}
      </div>
    </div>
  );
};

export default CoachDashboard; 