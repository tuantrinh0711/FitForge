import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutDetail, WorkoutListItem } from '@/src/types/workouts';

type WorkoutSummaryProps = {
  workouts?: WorkoutListItem[];
  workout?: WorkoutDetail;
};

export function WorkoutSummary({ workouts, workout }: WorkoutSummaryProps) {
  const summary = workout ? getDetailSummary(workout) : getListSummary(workouts ?? []);

  return (
    <View style={styles.container}>
      {summary.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text selectable style={styles.value}>
            {item.value}
          </Text>
          <Text selectable style={styles.label}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function getListSummary(workouts: WorkoutListItem[]) {
  const totalSets = workouts.reduce((total, item) => total + item.setCount, 0);
  const latest = workouts[0]?.name ?? 'None yet';

  return [
    { label: 'Workouts', value: String(workouts.length) },
    { label: 'Total sets', value: String(totalSets) },
    { label: 'Latest', value: latest },
  ];
}

function getDetailSummary(workout: WorkoutDetail) {
  const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const volume = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.reduce((sum, set) => sum + set.reps * set.weight, 0),
    0
  );

  return [
    { label: 'Exercises', value: String(workout.exercises.length) },
    { label: 'Sets', value: String(totalSets) },
    { label: 'Volume', value: volume.toLocaleString() },
  ];
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  item: {
    flex: 1,
    minHeight: 86,
    justifyContent: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#ecfdf5',
    padding: 14,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  },
  value: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  label: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
});
