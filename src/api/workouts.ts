import Constants from 'expo-constants';

import type {
  AddExerciseDto,
  AddSetDto,
  CreateWorkoutDto,
  WorkoutDetail,
  WorkoutExercise,
  WorkoutListItem,
  WorkoutSet,
} from '@/src/types/workouts';

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? (Constants.expoConfig?.extra?.apiUrl as string | undefined);

const API_BASE_URL = resolveApiBaseUrl(configuredBaseUrl);
const REQUEST_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function resolveApiBaseUrl(configuredUrl?: string) {
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const host = getExpoDevServerHost();

  if (host) {
    return `http://${host}:3000`;
  }

  if (process.env.EXPO_OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

function getExpoDevServerHost() {
  const constants = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    expoGoConfig?: { debuggerHost?: string };
    manifest?: { debuggerHost?: string };
  };

  const hostUri =
    constants.expoConfig?.hostUri ??
    constants.expoGoConfig?.debuggerHost ??
    constants.manifest?.debuggerHost;

  return hostUri?.split(':')[0];
}

export async function listWorkouts(): Promise<WorkoutListItem[]> {
  const data = await request<unknown>('/api/workouts');
  const items = Array.isArray(data) ? data : getArray(data, ['workouts', 'items', 'data']);

  return items.map(normalizeWorkoutListItem);
}

export async function createWorkout(input: CreateWorkoutDto): Promise<WorkoutDetail> {
  const data = await request<unknown>('/api/workouts', {
    method: 'POST',
    body: input,
  });

  return normalizeWorkoutDetail(data);
}

export async function getWorkout(id: string): Promise<WorkoutDetail> {
  const data = await request<unknown>(`/api/workouts/${encodeURIComponent(id)}`);

  return normalizeWorkoutDetail(data);
}

export async function addExercise(
  workoutId: string,
  input: AddExerciseDto
): Promise<WorkoutDetail> {
  const data = await request<unknown>(`/api/workouts/${encodeURIComponent(workoutId)}/exercises`, {
    method: 'POST',
    body: input,
  });

  return normalizeWorkoutDetail(data);
}

export async function addSet(
  workoutId: string,
  exerciseId: string,
  input: AddSetDto
): Promise<WorkoutDetail> {
  const data = await request<unknown>(
    `/api/workouts/${encodeURIComponent(workoutId)}/exercises/${encodeURIComponent(exerciseId)}/sets`,
    {
      method: 'POST',
      body: input,
    }
  );

  return normalizeWorkoutDetail(data);
}

async function request<T>(
  path: string,
  options: { method?: string; body?: Record<string, unknown> } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new ApiError(getErrorMessage(data) ?? `Request failed with status ${response.status}`, response.status);
    }

    return data as T;
  } catch (caught) {
    if (caught instanceof ApiError) {
      throw caught;
    }

    const message = caught instanceof Error && caught.name === 'AbortError'
      ? `Request timed out connecting to ${API_BASE_URL}.`
      : `Network request failed connecting to ${API_BASE_URL}.`;

    throw new ApiError(message, 0);
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeWorkoutListItem(value: unknown): WorkoutListItem {
  const record = getRecord(value);
  const exercises = getArray(record.exercises);
  const normalizedExercises = exercises.map(normalizeWorkoutExercise);

  return {
    id: getString(record.id) ?? getString(record._id) ?? '',
    name: getString(record.name) ?? 'Untitled Workout',
    exerciseCount: getNumber(record.exerciseCount) ?? normalizedExercises.length,
    setCount:
      getNumber(record.setCount) ??
      normalizedExercises.reduce((total, exercise) => total + exercise.sets.length, 0),
    updatedAt: getString(record.updatedAt),
    createdAt: getString(record.createdAt),
  };
}

function normalizeWorkoutDetail(value: unknown): WorkoutDetail {
  const record = getRecord(value);
  const workout = getRecord(record.workout ?? record.data ?? record);
  const exercises = getArray(workout.exercises).map(normalizeWorkoutExercise);

  return {
    id: getString(workout.id) ?? getString(workout._id) ?? '',
    name: getString(workout.name) ?? 'Untitled Workout',
    exercises,
    updatedAt: getString(workout.updatedAt),
    createdAt: getString(workout.createdAt),
  };
}

function normalizeWorkoutExercise(value: unknown): WorkoutExercise {
  const record = getRecord(value);
  const exerciseId = getString(record.exerciseId) ?? getString(record.id) ?? '';

  return {
    id: getString(record.id) ?? exerciseId,
    exerciseId,
    name: getString(record.name) ?? 'Exercise',
    notes: getString(record.notes),
    sets: getArray(record.sets).map(normalizeWorkoutSet),
  };
}

function normalizeWorkoutSet(value: unknown): WorkoutSet {
  const record = getRecord(value);

  return {
    id: getString(record.id) ?? getString(record._id) ?? `${getNumber(record.reps) ?? 0}-${getNumber(record.weight) ?? 0}`,
    reps: getNumber(record.reps) ?? 0,
    weight: getNumber(record.weight) ?? 0,
    createdAt: getString(record.createdAt),
  };
}

function getArray(value: unknown, keys: string[] = []): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  const record = getRecord(value);
  for (const key of keys) {
    if (Array.isArray(record[key])) {
      return record[key];
    }
  }

  return [];
}

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function getErrorMessage(value: unknown): string | undefined {
  const record = getRecord(value);
  const message = record.message;

  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === 'string').join('\n');
  }

  return undefined;
}
