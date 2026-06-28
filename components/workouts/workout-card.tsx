import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutListItem } from '@/src/types/workouts';

type WorkoutCardProps = {
  workout: WorkoutListItem;
};

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Link href={`/workouts/${workout.id}` as Href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.header}>
          <Text selectable style={styles.title}>
            {workout.name}
          </Text>
          <Text selectable style={styles.date}>
            {formatDate(workout.updatedAt ?? workout.createdAt)}
          </Text>
        </View>
        <View style={styles.metrics}>
          <Metric label="Exercises" value={workout.exerciseCount} />
          <Metric label="Sets" value={workout.setCount} />
        </View>
      </Pressable>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metric}>
      <Text selectable style={styles.metricValue}>
        {value}
      </Text>
      <Text selectable style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return 'No date';
  }

  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));
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
  pressed: {
    opacity: 0.76,
  },
  header: {
    gap: 4,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    color: '#64748b',
    fontSize: 13,
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
  },
  metric: {
    minWidth: 96,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#f8fafc',
    padding: 10,
  },
  metricValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
});
