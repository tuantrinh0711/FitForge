export type CreateWorkoutDto = {
  name: string;
};

export type AddExerciseDto = {
  exerciseId: string;
  name: string;
  notes?: string;
};

export type AddSetDto = {
  reps: number;
  weight: number;
};

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  createdAt?: string;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  name: string;
  notes?: string;
  sets: WorkoutSet[];
};

export type WorkoutListItem = {
  id: string;
  name: string;
  exerciseCount: number;
  setCount: number;
  updatedAt?: string;
  createdAt?: string;
};

export type WorkoutDetail = {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  updatedAt?: string;
  createdAt?: string;
};

export type ExerciseSearchResult = {
  id: string;
  name: string;
  category?: string;
  primaryMuscles?: string[];
};
