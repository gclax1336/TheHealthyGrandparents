export const exercises = {
  warmup: [
    {
      id: 'warmup-1',
      name: 'Gentle Walking',
      description: 'Walk around the room or in place for 2-3 minutes',
      duration: '2-3 minutes',
      safetyGuidelines: 'Ensure the walking area is clear of obstacles and has good lighting. Wear supportive shoes and use a walker or cane if needed for stability.'
    },
    {
      id: 'warmup-2',
      name: 'Arm Circles',
      description: 'Make small circles with your arms, forward and backward',
      duration: '30 seconds each direction',
      safetyGuidelines: 'Stand near a wall or chair for support if needed. Keep movements small and controlled. Stop if you feel any shoulder pain.'
    },
    {
      id: 'warmup-3',
      name: 'Hip Circles',
      description: 'Stand with hands on hips, make gentle circles with your hips',
      duration: '30 seconds each direction',
      safetyGuidelines: 'Hold onto a sturdy chair or counter for support. Keep movements small and controlled. Stop if you feel any hip pain.'
    }
  ],

  functional: [
    {
      id: 'func-1',
      name: 'Chair Circuit',
      description: 'Sit down and stand up from a chair, then walk to another chair and repeat',
      difficulty: 'Beginner',
      equipment: 'Two sturdy chairs',
      sets: 3,
      reps: '5-8 transitions',
      rest: '30 seconds',
      safetyGuidelines: "Use chairs with armrests for support. Ensure chairs are stable and won't slide. Place chairs close enough together to minimize walking distance. Have someone nearby for assistance if needed."
    },
    {
      id: 'func-2',
      name: 'Step and Reach',
      description: 'Step up onto a low step or platform, reach overhead, then step down',
      difficulty: 'Beginner',
      equipment: 'Step or low platform',
      sets: 3,
      reps: '8-10 each side',
      rest: '30 seconds',
      safetyGuidelines: 'Use a step no higher than 4 inches. Stand near a wall or sturdy furniture for support. Keep one hand on support while reaching with the other. Step down slowly and with control.'
    },
    {
      id: 'func-3',
      name: 'Carry and Place',
      description: 'Pick up an object, walk with it, and place it on a surface at different heights',
      difficulty: 'Beginner',
      equipment: 'Light weight (2-5 lbs)',
      sets: 3,
      reps: '4-6 carries',
      rest: '30 seconds',
      safetyGuidelines: 'Start with very light weights (like a small water bottle). Keep the path clear of obstacles. Use a walker or cane if needed for stability. Bend knees when picking up and placing objects.'
    }
  ],

  strength: [
    {
      id: 'strength-1',
      name: 'Chair Squats',
      description: 'Build leg strength safely using a chair',
      instructions: [
        'Stand in front of a sturdy chair',
        'Lower yourself as if sitting down',
        'Just before touching the chair, stand back up',
        'Keep your back straight',
        'Repeat 10-15 times'
      ],
      safety: [
        'Use a sturdy, non-rolling chair',
        'Keep your knees behind your toes',
        'Don\'t let your knees cave inward',
        'Stop if you feel pain'
      ],
      difficulty: 'Beginner',
      duration: '10 minutes',
      equipment: 'Sturdy chair'
    },
    {
      id: 'strength-2',
      name: 'Wall Push-ups',
      description: 'Build upper body strength with minimal joint stress',
      instructions: [
        'Stand facing a wall, arms length away',
        'Place hands on wall at shoulder height',
        'Bend elbows to bring chest toward wall',
        'Push back to starting position',
        'Repeat 10-15 times'
      ],
      safety: [
        'Keep your core engaged',
        'Maintain a straight line from head to heels',
        'Don\'t lock your elbows',
        'Stop if you feel shoulder pain'
      ],
      difficulty: 'Beginner',
      duration: '5-10 minutes',
      equipment: 'Wall'
    },
    {
      id: 'strength-3',
      name: 'Standing Rows',
      description: 'Using a resistance band or light weight, pull toward your body',
      difficulty: 'Beginner',
      equipment: 'Resistance band or light weight',
      sets: 3,
      reps: '10-12',
      rest: '30 seconds',
      safetyGuidelines: 'Stand near a wall or chair for support. Start with very light resistance. Keep back straight and shoulders relaxed. Move slowly and with control.'
    }
  ],

  balance: [
    {
      id: 'balance-1',
      name: 'Single Leg Stand',
      description: 'Improve balance and stability by standing on one leg',
      instructions: [
        'Stand next to a chair or wall for support',
        'Lift one foot slightly off the ground',
        'Hold for 10-30 seconds',
        'Switch legs and repeat',
        'Aim for 3 sets per leg'
      ],
      safety: [
        'Always have support nearby',
        'Stop if you feel unsteady',
        'Keep your core engaged',
        'Don\'t lock your standing knee'
      ],
      difficulty: 'Beginner',
      duration: '5-10 minutes',
      equipment: 'Chair or wall for support'
    },
    {
      id: 'balance-2',
      name: 'Heel-to-Toe Walk',
      description: 'Practice walking in a straight line with precise foot placement',
      instructions: [
        'Stand with feet together',
        'Place one foot directly in front of the other',
        'Walk forward in a straight line',
        'Keep your eyes focused ahead',
        'Take 10-15 steps'
      ],
      safety: [
        'Have a wall or support nearby',
        'Take your time with each step',
        'Stop if you feel dizzy',
        'Keep your core engaged'
      ],
      difficulty: 'Beginner',
      duration: '5 minutes',
      equipment: 'None'
    },
    {
      id: 'balance-3',
      name: 'Side Stepping',
      description: 'Step sideways while maintaining balance',
      difficulty: 'Beginner',
      equipment: 'None',
      sets: 2,
      reps: '8-10 steps each direction',
      rest: '30 seconds',
      safetyGuidelines: 'Perform next to a wall or counter for support. Take small steps and move slowly. Keep one hand on support if needed. Stop if you feel unsteady.'
    }
  ],

  cardio: [
    {
      id: 'cardio-1',
      name: 'Seated Marching',
      description: 'Get your heart rate up while seated',
      instructions: [
        'Sit on a chair with good posture',
        'Lift one knee toward chest',
        'Lower and repeat with other leg',
        'Continue alternating legs',
        'Aim for 2-3 minutes'
      ],
      safety: [
        'Keep your back straight',
        'Don\'t hold your breath',
        'Stop if you feel dizzy',
        'Keep movements controlled'
      ],
      difficulty: 'Beginner',
      duration: '5-10 minutes',
      equipment: 'Chair'
    },
    {
      id: 'cardio-2',
      name: 'Walking in Place',
      description: 'Simple cardio exercise that can be done anywhere',
      instructions: [
        'Stand with feet hip-width apart',
        'March in place, lifting knees',
        'Swing arms naturally',
        'Start with 1-2 minutes',
        'Gradually increase duration'
      ],
      safety: [
        'Have support nearby if needed',
        'Stop if you feel dizzy',
        'Keep movements controlled',
        'Wear supportive shoes'
      ],
      difficulty: 'Beginner',
      duration: '5-15 minutes',
      equipment: 'None'
    },
    {
      id: 'cardio-3',
      name: 'Chair Step-ups',
      description: 'Step up and down on a sturdy chair',
      difficulty: 'Beginner',
      equipment: 'Sturdy chair',
      sets: 3,
      reps: '30 seconds',
      rest: '30 seconds',
      safetyGuidelines: 'Use a sturdy chair with a backrest. Place the chair against a wall. Hold onto the backrest while stepping. Move slowly and with control. Stop if you feel any pain.'
    }
  ],

  cooldown: [
    {
      id: 'cooldown-1',
      name: 'Gentle Walking',
      description: 'Walk slowly around the room or in place',
      duration: '2-3 minutes',
      safetyGuidelines: 'Ensure the walking area is clear of obstacles. Use a walker or cane if needed. Move slowly and with control. Stop if you feel any pain or dizziness.'
    },
    {
      id: 'cooldown-2',
      name: 'Shoulder Rolls',
      description: 'Roll shoulders forward and backward',
      duration: '30 seconds each direction',
      safetyGuidelines: 'Stand near a wall or chair for support. Keep movements small and controlled. Stop if you feel any shoulder pain.'
    },
    {
      id: 'cooldown-3',
      name: 'Deep Breathing',
      description: 'Take deep breaths, inhaling through nose and exhaling through mouth',
      duration: '1-2 minutes',
      safetyGuidelines: 'Sit in a comfortable chair with back support. Breathe at a comfortable pace. Stop if you feel lightheaded or dizzy.'
    }
  ]
};

export const workoutPrograms = [
  {
    id: 'beginner-1',
    name: 'Getting Started',
    description: 'A gentle introduction to exercise for beginners',
    exercises: [
      exercises.balance[0],
      exercises.strength[0],
      exercises.flexibility[0],
      exercises.cardio[0]
    ],
    duration: '20-30 minutes',
    difficulty: 'Beginner',
    frequency: '2-3 times per week'
  },
  {
    id: 'balance-1',
    name: 'Balance Builder',
    description: 'Focus on improving stability and preventing falls',
    exercises: [
      exercises.balance[0],
      exercises.balance[1],
      exercises.strength[0],
      exercises.flexibility[1]
    ],
    duration: '25-35 minutes',
    difficulty: 'Beginner',
    frequency: '2-3 times per week'
  },
  {
    id: 'strength-1',
    name: 'Strength Foundation',
    description: 'Build muscle strength safely',
    exercises: [
      exercises.strength[0],
      exercises.strength[1],
      exercises.flexibility[0],
      exercises.cardio[1]
    ],
    duration: '30-40 minutes',
    difficulty: 'Beginner',
    frequency: '2-3 times per week'
  }
];

export const getRandomWorkout = () => {
  const program = workoutPrograms[Math.floor(Math.random() * workoutPrograms.length)];
  return {
    ...program,
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
}; 