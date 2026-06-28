import { Link, useFocusEffect } from 'expo-router';
import type { Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WorkoutCard } from '@/components/workouts/workout-card';
import { WorkoutEmptyState } from '@/components/workouts/workout-empty-state';
import { WorkoutSummary } from '@/components/workouts/workout-summary';
import { listWorkouts } from '@/src/api/workouts';
import type { WorkoutListItem } from '@/src/types/workouts';

type WorkoutListState =
  | { status: 'loading' }
  | { status: 'ready'; workouts: WorkoutListItem[] }
  | { status: 'empty' }
  | { status: 'error'; message: string };

export default function WorkoutsDashboardScreen() {
  const [state, setState] = useState<WorkoutListState>({ status: 'loading' });

  const loadWorkouts = useCallback(async () => {
    try {
      setState((current) => (current.status === 'ready' ? current : { status: 'loading' }));
      const workouts = await listWorkouts();
      setState(workouts.length > 0 ? { status: 'ready', workouts } : { status: 'empty' });
    } catch (caught) {
      setState({
        status: 'error',
        message: caught instanceof Error ? caught.message : 'Unable to load workouts.',
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts])
  );

  const workouts = state.status === 'ready' ? state.workouts : [];

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <WorkoutSummary workouts={workouts} />

      <View style={styles.actionRow}>
        <Link href={"/workouts/new" as Href} asChild>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>New Workout</Text>
          </Pressable>
        </Link>
      </View>

      {state.status === 'loading' ? (
        <Text selectable style={styles.message}>
          Loading workouts...
        </Text>
      ) : null}

      {state.status === 'error' ? (
        <View style={styles.errorBox}>
          <Text selectable style={styles.errorText}>
            {state.message}
          </Text>
          <Pressable onPress={loadWorkouts} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {state.status === 'empty' ? <WorkoutEmptyState /> : null}

      {state.status === 'ready' ? (
        <View style={styles.list}>
          {state.workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View>
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
  actionRow: {
    flexDirection: 'row',
  },
  primaryButton: {
    minHeight: 46,
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
  message: {
    color: '#475569',
    fontSize: 15,
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
  list: {
    gap: 12,
  },
});
