import { Workout, Exercise, ExerciseCategory, MuscleGroup } from '../types';
import uuid from 'react-native-uuid';

export const sampleExercises = [
  {
    id: uuid.v4() as string,
    name: 'Press de Banca',
    category: 'chest' as ExerciseCategory,
    muscleGroups: ['chest', 'triceps'] as MuscleGroup[],
    sets: [],
  },
  {
    id: uuid.v4() as string,
    name: 'Sentadillas',
    category: 'legs' as ExerciseCategory,
    muscleGroups: ['quadriceps', 'glutes'] as MuscleGroup[],
    sets: [],
  },
  {
    id: uuid.v4() as string,
    name: 'Peso Muerto',
    category: 'back' as ExerciseCategory,
    muscleGroups: ['back', 'hamstrings', 'glutes'] as MuscleGroup[],
    sets: [],
  },
  {
    id: uuid.v4() as string,
    name: 'Press Militar',
    category: 'shoulders' as ExerciseCategory,
    muscleGroups: ['shoulders', 'triceps'] as MuscleGroup[],
    sets: [],
  },
  {
    id: uuid.v4() as string,
    name: 'Dominadas',
    category: 'back' as ExerciseCategory,
    muscleGroups: ['back', 'biceps'] as MuscleGroup[],
    sets: [],
  },
  {
    id: uuid.v4() as string,
    name: 'Curl de Bíceps',
    category: 'arms' as ExerciseCategory,
    muscleGroups: ['biceps'] as MuscleGroup[],
    sets: [],
  },
  {
    id: uuid.v4() as string,
    name: 'Extensiones de Tríceps',
    category: 'arms' as ExerciseCategory,
    muscleGroups: ['triceps'] as MuscleGroup[],
    sets: [],
  },
  {
    id: uuid.v4() as string,
    name: 'Plancha',
    category: 'core' as ExerciseCategory,
    muscleGroups: ['abs'] as MuscleGroup[],
    sets: [],
  },
];

export const createSampleWorkouts = (): Workout[] => {
  const now = new Date();
  const workouts: Workout[] = [];

  // Create workouts for the last 2 weeks
  for (let i = 0; i < 10; i++) {
    const workoutDate = new Date(now);
    workoutDate.setDate(workoutDate.getDate() - (i * 2)); // Every other day

    const workoutId = uuid.v4() as string;
    const isCompleted = i < 8; // Last 8 workouts are completed

    // Alternate between different workout types
    let exercises: Exercise[] = [];
    let workoutName = '';

    if (i % 3 === 0) {
      // Push workout
      workoutName = 'Entrenamiento de Empuje';
      exercises = [
        {
          ...sampleExercises[0], // Press de Banca
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 12, weight: 80, completed: isCompleted },
            { id: uuid.v4() as string, reps: 10, weight: 85, completed: isCompleted },
            { id: uuid.v4() as string, reps: 8, weight: 90, completed: isCompleted },
          ],
        },
        {
          ...sampleExercises[3], // Press Militar
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 12, weight: 50, completed: isCompleted },
            { id: uuid.v4() as string, reps: 10, weight: 55, completed: isCompleted },
            { id: uuid.v4() as string, reps: 8, weight: 60, completed: isCompleted },
          ],
        },
        {
          ...sampleExercises[6], // Extensiones de Tríceps
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 15, weight: 25, completed: isCompleted },
            { id: uuid.v4() as string, reps: 12, weight: 30, completed: isCompleted },
            { id: uuid.v4() as string, reps: 10, weight: 35, completed: isCompleted },
          ],
        },
      ];
    } else if (i % 3 === 1) {
      // Pull workout
      workoutName = 'Entrenamiento de Tirón';
      exercises = [
        {
          ...sampleExercises[2], // Peso Muerto
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 8, weight: 120, completed: isCompleted },
            { id: uuid.v4() as string, reps: 6, weight: 130, completed: isCompleted },
            { id: uuid.v4() as string, reps: 5, weight: 140, completed: isCompleted },
          ],
        },
        {
          ...sampleExercises[4], // Dominadas
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 10, weight: 0, completed: isCompleted },
            { id: uuid.v4() as string, reps: 8, weight: 0, completed: isCompleted },
            { id: uuid.v4() as string, reps: 6, weight: 0, completed: isCompleted },
          ],
        },
        {
          ...sampleExercises[5], // Curl de Bíceps
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 12, weight: 20, completed: isCompleted },
            { id: uuid.v4() as string, reps: 10, weight: 22.5, completed: isCompleted },
            { id: uuid.v4() as string, reps: 8, weight: 25, completed: isCompleted },
          ],
        },
      ];
    } else {
      // Legs workout
      workoutName = 'Entrenamiento de Piernas';
      exercises = [
        {
          ...sampleExercises[1], // Sentadillas
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 12, weight: 100, completed: isCompleted },
            { id: uuid.v4() as string, reps: 10, weight: 110, completed: isCompleted },
            { id: uuid.v4() as string, reps: 8, weight: 120, completed: isCompleted },
          ],
        },
        {
          ...sampleExercises[7], // Plancha
          id: uuid.v4() as string,
          sets: [
            { id: uuid.v4() as string, reps: 60, weight: 0, completed: isCompleted }, // 60 seconds
            { id: uuid.v4() as string, reps: 45, weight: 0, completed: isCompleted },
            { id: uuid.v4() as string, reps: 30, weight: 0, completed: isCompleted },
          ],
        },
      ];
    }

    workouts.push({
      id: workoutId,
      name: workoutName,
      date: workoutDate.toISOString(),
      exercises,
      duration: isCompleted ? 3600 + Math.random() * 1800 : 0, // 1-2.5 hours
      completed: isCompleted,
      notes: i === 0 ? 'Gran entrenamiento hoy, me sentí muy fuerte!' : undefined,
    });
  }

  return workouts.reverse(); // Most recent first
};

export const exerciseDatabase = [
  // Chest
  { name: 'Press de Banca', category: 'chest', muscleGroups: ['chest', 'triceps'] },
  { name: 'Press Inclinado', category: 'chest', muscleGroups: ['chest', 'triceps'] },
  { name: 'Aperturas', category: 'chest', muscleGroups: ['chest'] },
  { name: 'Fondos', category: 'chest', muscleGroups: ['chest', 'triceps'] },
  
  // Back
  { name: 'Peso Muerto', category: 'back', muscleGroups: ['back', 'hamstrings', 'glutes'] },
  { name: 'Dominadas', category: 'back', muscleGroups: ['back', 'biceps'] },
  { name: 'Remo con Barra', category: 'back', muscleGroups: ['back', 'biceps'] },
  { name: 'Jalones', category: 'back', muscleGroups: ['back', 'biceps'] },
  
  // Shoulders
  { name: 'Press Militar', category: 'shoulders', muscleGroups: ['shoulders', 'triceps'] },
  { name: 'Elevaciones Laterales', category: 'shoulders', muscleGroups: ['shoulders'] },
  { name: 'Elevaciones Posteriores', category: 'shoulders', muscleGroups: ['shoulders'] },
  { name: 'Press Arnold', category: 'shoulders', muscleGroups: ['shoulders', 'triceps'] },
  
  // Arms
  { name: 'Curl de Bíceps', category: 'arms', muscleGroups: ['biceps'] },
  { name: 'Curl Martillo', category: 'arms', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Extensiones de Tríceps', category: 'arms', muscleGroups: ['triceps'] },
  { name: 'Press Francés', category: 'arms', muscleGroups: ['triceps'] },
  
  // Legs
  { name: 'Sentadillas', category: 'legs', muscleGroups: ['quadriceps', 'glutes'] },
  { name: 'Prensa de Piernas', category: 'legs', muscleGroups: ['quadriceps', 'glutes'] },
  { name: 'Peso Muerto Rumano', category: 'legs', muscleGroups: ['hamstrings', 'glutes'] },
  { name: 'Extensiones de Cuádriceps', category: 'legs', muscleGroups: ['quadriceps'] },
  { name: 'Curl de Femoral', category: 'legs', muscleGroups: ['hamstrings'] },
  { name: 'Elevaciones de Gemelos', category: 'legs', muscleGroups: ['calves'] },
  
  // Core
  { name: 'Plancha', category: 'core', muscleGroups: ['abs'] },
  { name: 'Abdominales', category: 'core', muscleGroups: ['abs'] },
  { name: 'Plancha Lateral', category: 'core', muscleGroups: ['abs', 'obliques'] },
  { name: 'Mountain Climbers', category: 'core', muscleGroups: ['abs'] },
]; 