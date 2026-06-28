import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { addSet } from '@/src/api/workouts';

type SetRowProps = {
  workoutId: string;
  exerciseId: string;
  onSaved: () => Promise<void> | void;
};

export function SetRow({ workoutId, exerciseId, onSaved }: SetRowProps) {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const parsedReps = Number(reps);
  const parsedWeight = Number(weight);
  const isValid = Number.isFinite(parsedReps) && parsedReps >= 1 && Number.isFinite(parsedWeight) && parsedWeight >= 0;

  async function handleSave() {
    if (!isValid || isSubmitting) {
      setError('Enter reps of 1 or more and weight of 0 or more.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(undefined);
      await addSet(workoutId, exerciseId, {
        reps: parsedReps,
        weight: parsedWeight,
      });
      setReps('');
      setWeight('');
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await onSaved();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save set.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          value={reps}
          onChangeText={setReps}
          placeholder="Reps"
          keyboardType="number-pad"
          inputMode="numeric"
          style={styles.input}
        />
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="Weight"
          keyboardType="decimal-pad"
          inputMode="decimal"
          style={styles.input}
        />
        <Pressable
          disabled={!isValid || isSubmitting}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.button,
            (!isValid || isSubmitting) && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Saving' : 'Save Set'}</Text>
        </Pressable>
      </View>
      {error ? (
        <Text selectable style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputs: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    paddingHorizontal: 12,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  button: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: '#0f766e',
    paddingHorizontal: 12,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.76,
  },
  error: {
    color: '#b91c1c',
    fontSize: 13,
  },
});
