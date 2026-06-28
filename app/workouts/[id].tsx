import { Link, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ExerciseCard } from '@/components/workouts/exercise-card';
import { WorkoutSummary } from '@/components/workouts/workout-summary';
import { getWorkout } from '@/src/api/workouts';
import type { WorkoutDetail } from '@/src/types/workouts';

type WorkoutDetailState =
  | { status: 'loading' }
  | { status: 'ready'; workout: WorkoutDetail }
  | { status: 'error'; message: string };

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = Array.isArray(id) ? id[0] : id;
  const [state, setState] = useState<WorkoutDetailState>({ status: 'loading' });

  const loadWorkout = useCallback(async () => {
    if (!workoutId) {
      setState({ status: 'error', message: 'Workout ID is missing.' });
      return;
    }

    try {
      setState((current) => (current.status === 'ready' ? current : { status: 'loading' }));
      const workout = await getWorkout(workoutId);
      setState({ status: 'ready', workout });
    } catch (caught) {
      setState({
        status: 'error',
        message: caught instanceof Error ? caught.message : 'Unable to load workout.',
      });
    }
  }, [workoutId]);

  useFocusEffect(
    useCallback(() => {
      loadWorkout();
    }, [loadWorkout])
  );

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      {state.status === 'ready' ? <Stack.Screen options={{ title: state.workout.name }} /> : null}

      {state.status === 'loading' ? (
        <Text selectable style={styles.message}>
          Loading workout...
        </Text>
      ) : null}

      {state.status === 'error' ? (
        <View style={styles.errorBox}>
          <Text selectable style={styles.errorText}>
            {state.message}
          </Text>
          <Pressable onPress={loadWorkout} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {state.status === 'ready' ? (
        <>
          <WorkoutSummary workout={state.workout} />

          <Link href={`/workouts/${workoutId}/add-exercise` as Href} asChild>
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryButtonText}>Add Exercise</Text>
            </Pressable>
          </Link>

          {state.workout.exercises.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text selectable style={styles.emptyTitle}>
                No exercises yet
              </Text>
              <Text selectable style={styles.emptyText}>
                Add an exercise, then log sets as you complete them.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {state.workout.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id || exercise.exerciseId}
                  workoutId={state.workout.id || workoutId}
                  exercise={exercise}
                  onSetSaved={loadWorkout}
                />
              ))}
            </View>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 16,
    backgroundColor: '#eef2f6',
  },
  message: {
    color: '#475569',
    fontSize: 15,
  },
  primaryButton: {
    minHeight: 46,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#0f766e',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 42,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#0f766e',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.76,
  },
  errorBox: {
    gap: 12,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#fee2e2',
    padding: 16,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyBox: {
    gap: 8,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
});
