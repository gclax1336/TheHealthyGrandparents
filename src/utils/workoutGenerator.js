import { exercises } from '../data/exercises';
import { workoutGuidelines } from '../data/workoutGuidelines';

// Helper function to get random exercises from a category
const getRandomExercises = (category, count) => {
  const categoryExercises = exercises[category];
  const shuffled = [...categoryExercises].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a daily workout
export const generateDailyWorkout = () => {
  const workout = {
    date: new Date(),
    warmup: exercises.warmup,
    mainWorkout: {
      functional: getRandomExercises('functional', 2),
      strength: getRandomExercises('strength', 2),
      balance: getRandomExercises('balance', 1),
      cardio: getRandomExercises('cardio', 1)
    },
    cooldown: exercises.cooldown
  };

  return workout;
};

// Generate a week's worth of workouts
export const generateWeeklyWorkouts = () => {
  const workouts = [];
  for (let i = 0; i < 7; i++) {
    workouts.push(generateDailyWorkout());
  }
  return workouts;
}; 