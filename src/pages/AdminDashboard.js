import React, { useState } from 'react';
import { workoutPrograms as initialPrograms } from '../data/workoutPrograms';

const CoachDashboard = () => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ category: '', description: '' });
  const [newProgram, setNewProgram] = useState({ category: '', description: '' });

  // Edit handlers
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

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Coach Dashboard</h1>
      <h2>Workout Programs & Categories</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {programs.map(program => (
          <li key={program.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
            {editingId === program.id ? (
              <>
                <input
                  type="text"
                  value={editData.category}
                  onChange={e => setEditData({ ...editData, category: e.target.value })}
                  style={{ fontWeight: 600, fontSize: '1.1rem', marginRight: 8 }}
                />
                <input
                  type="text"
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  style={{ width: 300, marginRight: 8 }}
                />
                <button onClick={() => saveEdit(program.id)} style={{ marginRight: 8 }}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{program.category}</span>
                <span style={{ color: '#666', marginLeft: 12 }}>{program.description}</span>
                <button onClick={() => startEdit(program)} style={{ marginLeft: 16 }}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: 32 }}>Add New Program/Category</h3>
      <form onSubmit={addProgram} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Category Name"
          value={newProgram.category}
          onChange={e => setNewProgram({ ...newProgram, category: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProgram.description}
          onChange={e => setNewProgram({ ...newProgram, description: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
      <p style={{ color: '#888', fontSize: '0.95em' }}>
        (Note: Changes here are in-memory only. For permanent changes, update the data file.)
      </p>
    </div>
  );
};

export default CoachDashboard; 