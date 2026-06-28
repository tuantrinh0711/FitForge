import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { addExercise } from '@/src/api/workouts';
import { exerciseCatalog } from '@/src/data/exercise-catalog';
import type { ExerciseSearchResult } from '@/src/types/workouts';

const MAX_NOTES_LENGTH = 500;

export default function AddExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = Array.isArray(id) ? id[0] : id;
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseSearchResult>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return exerciseCatalog;
    }

    return exerciseCatalog.filter((exercise) => {
      const searchable = [exercise.name, exercise.category, ...(exercise.primaryMuscles ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [query]);

  const validationError = !selectedExercise
    ? 'Choose an exercise.'
    : notes.length > MAX_NOTES_LENGTH
      ? 'Notes must be 500 characters or fewer.'
      : undefined;

  async function handleSubmit() {
    if (!workoutId) {
      setError('Workout ID is missing.');
      return;
    }

    if (!selectedExercise || validationError || isSubmitting) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(undefined);
      await addExercise(workoutId, {
        exerciseId: selectedExercise.id,
        name: selectedExercise.name,
        notes: notes.trim() || undefined,
      });
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to add exercise.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search exercises"
        autoFocus
        style={styles.input}
      />

      <View style={styles.results}>
        {results.length > 0 ? (
          results.map((exercise) => {
            const selected = selectedExercise?.id === exercise.id;

            return (
              <Pressable
                key={exercise.id}
                onPress={() => setSelectedExercise(exercise)}
                style={({ pressed }) => [styles.exerciseOption, selected && styles.exerciseOptionSelected, pressed && styles.pressed]}>
                <Text selectable style={styles.exerciseName}>
                  {exercise.name}
                </Text>
                <Text selectable style={styles.exerciseMeta}>
                  {[exercise.category, ...(exercise.primaryMuscles ?? [])].filter(Boolean).join(' • ')}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <Text selectable style={styles.message}>
            No exercises match your search.
          </Text>
        )}
      </View>

      <View style={styles.notesBox}>
        <Text selectable style={styles.label}>
          Notes
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional cues or setup notes"
          multiline
          maxLength={MAX_NOTES_LENGTH}
          style={[styles.input, styles.notesInput]}
        />
        <Text selectable style={styles.counter}>
          {notes.length}/{MAX_NOTES_LENGTH}
        </Text>
      </View>

      {error ? (
        <Text selectable style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Pressable
        disabled={Boolean(validationError) || isSubmitting}
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.button,
          (Boolean(validationError) || isSubmitting) && styles.buttonDisabled,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Adding' : 'Add Exercise'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    padding: 16,
    backgroundColor: '#eef2f6',
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  results: {
    gap: 8,
  },
  exerciseOption: {
    gap: 4,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    padding: 14,
  },
  exerciseOptionSelected: {
    borderColor: '#0f766e',
    backgroundColor: '#ecfdf5',
  },
  exerciseName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseMeta: {
    color: '#64748b',
    fontSize: 13,
  },
  message: {
    color: '#475569',
    fontSize: 15,
  },
  notesBox: {
    gap: 8,
  },
  label: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  notesInput: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    color: '#64748b',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
  },
  button: {
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#0f766e',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.76,
  },
});
