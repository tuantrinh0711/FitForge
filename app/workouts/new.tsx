import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { createWorkout } from '@/src/api/workouts';

const MAX_NAME_LENGTH = 120;

export default function NewWorkoutScreen() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const trimmedName = name.trim();
  const validationError =
    trimmedName.length === 0
      ? 'Workout name is required.'
      : trimmedName.length > MAX_NAME_LENGTH
        ? 'Workout name must be 120 characters or fewer.'
        : undefined;

  async function handleSubmit() {
    if (validationError || isSubmitting) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(undefined);
      await createWorkout({ name: trimmedName });
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create workout.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <Text selectable style={styles.label}>
          Workout name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Upper Body Strength"
          maxLength={MAX_NAME_LENGTH}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          style={styles.input}
        />
        <Text selectable style={styles.counter}>
          {name.length}/{MAX_NAME_LENGTH}
        </Text>
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
          <Text style={styles.buttonText}>{isSubmitting ? 'Creating' : 'Create Workout'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 16,
    backgroundColor: '#eef2f6',
  },
  form: {
    gap: 10,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  label: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
    paddingHorizontal: 12,
    fontSize: 16,
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
