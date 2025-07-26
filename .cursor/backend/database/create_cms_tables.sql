-- Healthy Grandparent CMS Database Tables
-- This script creates the necessary tables for workout content management

USE healthy_grandparent;

-- Workout Programs Table
CREATE TABLE IF NOT EXISTS workout_programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level ENUM('Beginner', 'Intermediate', 'Advanced', 'All Levels') DEFAULT 'Beginner',
    duration INT NOT NULL COMMENT 'Duration in minutes',
    difficulty_rating INT DEFAULT 1 COMMENT '1-5 scale',
    category VARCHAR(100) DEFAULT 'General',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    image_url VARCHAR(500),
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    duration INT DEFAULT 60 COMMENT 'Duration in seconds',
    sets INT DEFAULT 1,
    reps INT DEFAULT 10,
    safety_notes TEXT,
    equipment_needed VARCHAR(255) DEFAULT 'None',
    muscle_groups VARCHAR(255) COMMENT 'Comma-separated muscle groups',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_difficulty (difficulty),
    INDEX idx_active (is_active)
);

-- Program Exercises Junction Table
CREATE TABLE IF NOT EXISTS program_exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    exercise_id INT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    duration INT COMMENT 'Override exercise duration for this program',
    sets INT COMMENT 'Override exercise sets for this program',
    reps INT COMMENT 'Override exercise reps for this program',
    rest_time INT DEFAULT 30 COMMENT 'Rest time in seconds after this exercise',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES workout_programs(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    UNIQUE KEY unique_program_exercise (program_id, exercise_id, order_index),
    INDEX idx_program_order (program_id, order_index)
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    program_id INT,
    completed_workouts INT DEFAULT 0,
    total_minutes INT DEFAULT 0,
    strength_score INT DEFAULT 0 COMMENT '1-100 scale',
    balance_score INT DEFAULT 0 COMMENT '1-100 scale',
    flexibility_score INT DEFAULT 0 COMMENT '1-100 scale',
    last_workout_date TIMESTAMP NULL,
    current_streak INT DEFAULT 0 COMMENT 'Consecutive days with workouts',
    longest_streak INT DEFAULT 0,
    weekly_goal_minutes INT DEFAULT 150,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES workout_programs(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_progress (user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_program_id (program_id)
);

-- Workout Sessions Table
CREATE TABLE IF NOT EXISTS workout_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    program_id INT,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    exercises_completed INT DEFAULT 0,
    difficulty_rating INT COMMENT 'User rating 1-5',
    notes TEXT,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES workout_programs(id) ON DELETE SET NULL,
    INDEX idx_user_date (user_id, session_date),
    INDEX idx_program_id (program_id)
);

-- Session Exercises Table (tracks which exercises were completed in each session)
CREATE TABLE IF NOT EXISTS session_exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    exercise_id INT NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    actual_duration INT COMMENT 'Actual time spent on exercise in seconds',
    actual_sets INT,
    actual_reps INT,
    user_rating INT COMMENT 'User rating 1-5 for this exercise',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_exercise_id (exercise_id)
);

-- User Goals Table
CREATE TABLE IF NOT EXISTS user_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    goal_type ENUM('workouts_per_week', 'minutes_per_week', 'strength_score', 'balance_score', 'flexibility_score') NOT NULL,
    target_value INT NOT NULL,
    current_value INT DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_goal_type (goal_type)
);

-- Insert sample workout programs
INSERT INTO workout_programs (name, description, level, duration, difficulty_rating, category) VALUES
('Fall Prevention Basics', 'Essential exercises to improve balance and prevent falls. Perfect for beginners.', 'Beginner', 15, 1, 'Balance'),
('Strength Building', 'Gentle strength training to maintain muscle mass and improve daily activities.', 'Beginner', 20, 2, 'Strength'),
('Balance & Coordination', 'Advanced balance exercises to enhance stability and confidence.', 'Intermediate', 25, 3, 'Balance'),
('Getting Up Safely', 'Learn proper techniques for getting up from falls and difficult positions.', 'All Levels', 10, 1, 'Safety'),
('Daily Mobility', 'Flexibility and range of motion exercises for better daily movement.', 'All Levels', 15, 1, 'Flexibility'),
('Cardio Health', 'Safe cardiovascular exercises to improve heart health and endurance.', 'Intermediate', 30, 3, 'Cardio'),
('Core Strength', 'Focus on abdominal and back muscles for better posture and stability.', 'Beginner', 20, 2, 'Strength'),
('Leg Strength', 'Targeted exercises for leg muscles to improve walking and standing.', 'Beginner', 18, 2, 'Strength'),
('Upper Body Strength', 'Gentle exercises for arms, shoulders, and chest muscles.', 'Beginner', 15, 2, 'Strength'),
('Mindful Movement', 'Slow, controlled movements with breathing focus for overall wellness.', 'All Levels', 20, 1, 'Wellness');

-- Insert sample exercises
INSERT INTO exercises (name, description, difficulty, duration, sets, reps, safety_notes, equipment_needed, muscle_groups) VALUES
('Standing Balance', 'Stand on one leg while holding onto a chair for support. Gradually increase time.', 'Beginner', 30, 3, 1, 'Hold onto stable surface. Stop if you feel unsteady.', 'Chair', 'Legs, Core'),
('Chair Squats', 'Sit down and stand up from a chair slowly and controlled.', 'Beginner', 60, 3, 10, 'Use a sturdy chair. Keep feet flat on the floor.', 'Chair', 'Legs, Glutes'),
('Heel-to-Toe Walk', 'Walk in a straight line placing heel of one foot directly in front of toes of other foot.', 'Beginner', 120, 1, 1, 'Walk near a wall for support if needed.', 'None', 'Legs, Balance'),
('Wall Push-ups', 'Stand facing a wall, place hands on wall and perform push-ups.', 'Beginner', 60, 3, 10, 'Keep body straight. Don\'t lock elbows.', 'Wall', 'Chest, Arms'),
('Seated Marching', 'Sit in a chair and lift knees alternately as if marching.', 'Beginner', 60, 3, 20, 'Keep back straight. Lift knees to comfortable height.', 'Chair', 'Legs, Core'),
('Arm Circles', 'Stand or sit and make small circles with arms forward and backward.', 'Beginner', 60, 2, 10, 'Start with small circles. Stop if you feel pain.', 'None', 'Shoulders, Arms'),
('Standing Calf Raises', 'Stand and lift heels off the ground, then lower slowly.', 'Beginner', 60, 3, 15, 'Hold onto wall or chair for balance.', 'Wall or Chair', 'Calves'),
('Seated Leg Extensions', 'Sit and straighten one leg at a time, hold briefly, then lower.', 'Beginner', 60, 3, 10, 'Don\'t lock knees. Keep movement controlled.', 'Chair', 'Legs'),
('Shoulder Rolls', 'Roll shoulders forward and backward in circular motion.', 'Beginner', 60, 2, 10, 'Keep movements slow and controlled.', 'None', 'Shoulders'),
('Deep Breathing', 'Take slow, deep breaths in through nose and out through mouth.', 'Beginner', 120, 1, 1, 'Sit comfortably. Focus on breathing pattern.', 'None', 'Core, Relaxation');

-- Create indexes for better performance
CREATE INDEX idx_workout_programs_active_level ON workout_programs(is_active, level);
CREATE INDEX idx_exercises_active_difficulty ON exercises(is_active, difficulty);
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, session_date DESC);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Add comments to tables
ALTER TABLE workout_programs COMMENT = 'Stores workout program information and metadata';
ALTER TABLE exercises COMMENT = 'Stores individual exercise information and instructions';
ALTER TABLE program_exercises COMMENT = 'Junction table linking programs to exercises with order and customization';
ALTER TABLE user_progress COMMENT = 'Tracks user progress and fitness scores';
ALTER TABLE workout_sessions COMMENT = 'Records individual workout sessions';
ALTER TABLE session_exercises COMMENT = 'Tracks exercises completed in each session';
ALTER TABLE user_goals COMMENT = 'Stores user fitness goals and progress tracking'; 