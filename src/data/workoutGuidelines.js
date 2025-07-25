// Workout Guidelines for Functional Fitness
export const workoutGuidelines = {
  principles: {
    functional: "Exercises should mimic real-life movements and improve daily activities",
    scalable: "All workouts should be adaptable to different fitness levels",
    timeEfficient: "Workouts should be 20-30 minutes maximum",
    safe: "Focus on proper form and controlled movements",
    progressive: "Gradually increase difficulty as strength improves"
  },

  categories: {
    mobility: {
      description: "Movements to improve joint range of motion and flexibility",
      examples: [
        "Arm circles",
        "Hip circles",
        "Ankle mobility",
        "Shoulder rolls",
        "Neck stretches"
      ]
    },
    functional: {
      description: "Movements that mimic daily activities",
      examples: [
        "Sit to stand",
        "Chair transitions",
        "Step ups",
        "Walking with weight",
        "Carrying objects"
      ]
    },
    strength: {
      description: "Movements to build strength for daily tasks",
      examples: [
        "Bodyweight squats",
        "Wall push-ups",
        "Chair dips",
        "Standing rows",
        "Farmer's carries"
      ]
    },
    balance: {
      description: "Exercises to improve stability and prevent falls",
      examples: [
        "Single leg stands",
        "Heel-to-toe walking",
        "Standing on uneven surfaces",
        "Walking with head turns",
        "Standing on one leg while brushing teeth"
      ]
    },
    cardio: {
      description: "Movements to improve heart health and endurance",
      examples: [
        "Walking intervals",
        "Step touches",
        "Marching in place",
        "Light dancing",
        "Chair step-ups"
      ]
    }
  },

  workoutStructure: {
    warmup: {
      duration: "5-7 minutes",
      components: [
        "Light walking",
        "Joint mobility",
        "Dynamic stretching"
      ]
    },
    mainWorkout: {
      duration: "15-20 minutes",
      format: "Circuit style with minimal rest",
      components: [
        "3-4 functional movements",
        "1-2 balance exercises",
        "1-2 strength movements",
        "Cardio elements integrated throughout"
      ]
    },
    cooldown: {
      duration: "5 minutes",
      components: [
        "Light walking",
        "Static stretching",
        "Deep breathing"
      ]
    }
  },

  safetyGuidelines: {
    general: [
      "Always maintain proper form",
      "Stop if experiencing pain",
      "Stay hydrated",
      "Use stable surfaces",
      "Have support nearby if needed"
    ],
    modifications: [
      "Use chairs for support",
      "Reduce range of motion",
      "Decrease repetitions",
      "Increase rest periods",
      "Use lighter weights or no weights"
    ],
    contraindications: [
      "Avoid exercises that cause pain",
      "Modify high-impact movements",
      "Be cautious with balance exercises",
      "Avoid rapid movements",
      "Don't hold breath during exertion"
    ]
  },

  progressionRules: {
    beginner: {
      reps: "5-8 per exercise",
      sets: "1-2",
      rest: "30-60 seconds between exercises",
      frequency: "2-3 times per week"
    },
    intermediate: {
      reps: "8-12 per exercise",
      sets: "2-3",
      rest: "20-30 seconds between exercises",
      frequency: "3-4 times per week"
    },
    advanced: {
      reps: "12-15 per exercise",
      sets: "3-4",
      rest: "15-20 seconds between exercises",
      frequency: "4-5 times per week"
    }
  }
}; 