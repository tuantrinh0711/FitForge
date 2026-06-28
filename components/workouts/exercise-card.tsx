import { StyleSheet, Text, View } from 'react-native';

import { SetRow } from '@/components/workouts/set-row';
import type { WorkoutExercise } from '@/src/types/workouts';

type ExerciseCardProps = {
  workoutId: string;
  exercise: WorkoutExercise;
  onSetSaved: () => Promise<void> | void;
};

export function ExerciseCard({ workoutId, exercise, onSetSaved }: ExerciseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text selectable style={styles.title}>
          {exercise.name}
        </Text>
        {exercise.notes ? (
          <Text selectable style={styles.notes}>
            {exercise.notes}
          </Text>
        ) : null}
      </View>

      <View style={styles.sets}>
        {exercise.sets.length > 0 ? (
          exercise.sets.map((set, index) => (
            <View key={set.id || `${exercise.id}-${index}`} style={styles.savedSet}>
              <Text selectable style={styles.setLabel}>
                Set {index + 1}
              </Text>
              <Text selectable style={styles.setValue}>
                {set.reps} reps x {set.weight} lb
              </Text>
            </View>
          ))
        ) : (
          <Text selectable style={styles.emptySets}>
            No sets logged.
          </Text>
        )}
      </View>

      <SetRow workoutId={workoutId} exerciseId={exercise.exerciseId || exercise.id} onSaved={onSetSaved} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
    padding: 16,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.1)',
  },
  header: {
    gap: 4,
  },
  title: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '700',
  },
  notes: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  sets: {
    gap: 8,
  },
  savedSet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#f8fafc',
    padding: 10,
  },
  setLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  setValue: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  emptySets: {
    color: '#64748b',
    fontSize: 14,
  },
});
