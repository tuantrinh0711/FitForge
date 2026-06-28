import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type WorkoutEmptyStateProps = {
  message?: string;
};

export function WorkoutEmptyState({ message = 'Start your first session and log each exercise as you train.' }: WorkoutEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text selectable style={styles.title}>
        No workouts yet
      </Text>
      <Text selectable style={styles.message}>
        {message}
      </Text>
      <Link href={"/workouts/new" as Href} asChild>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>New Workout</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    alignItems: 'flex-start',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#f8fafc',
    padding: 18,
  },
  title: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 21,
  },
  button: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#0f766e',
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.76,
  },
});
