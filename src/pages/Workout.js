import React, { useState, useEffect } from 'react';
import { workoutPrograms } from '../data/workoutPrograms';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Workout = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});
  const query = useQuery();

  useEffect(() => {
    const programId = query.get('program');
    if (programId) {
      const found = workoutPrograms.find(p => p.id === programId);
      if (found) setSelectedProgram(found);
    }
  }, [query]);

  const toggleDay = (idx) => {
    setExpandedDays(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Category List */}
      {!selectedProgram && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workoutPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-blue-50 transition"
              onClick={() => setSelectedProgram(program)}
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{program.category}</h2>
              <p className="text-gray-700">{program.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Program Details */}
      {selectedProgram && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">{selectedProgram.category}</h2>
          <p className="text-gray-700 mb-4">{selectedProgram.description}</p>
          <div className="space-y-6">
            {selectedProgram.days.map((day, idx) => (
              <div key={day.title} className="workout-section">
                <h3
                  className="text-lg font-semibold mb-2 cursor-pointer"
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => toggleDay(idx)}
                >
                  {day.title}
                  <span style={{ marginLeft: 8, fontWeight: 'normal' }}>{expandedDays[idx] ? '▲' : '▼'}</span>
                </h3>
                {expandedDays[idx] && (
                  <ul className="list-disc list-inside ml-4">
                    {day.exercises.map((ex, i) => (
                      <li key={i} className="mb-1">
                        <span className="font-medium text-gray-900">{ex.name}</span>
                        {ex.details && <span className="text-gray-600"> – {ex.details}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout; 