import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme';

type FlowStepperProps = {
  steps: readonly string[];
  currentStep: number;
};

export function FlowStepper({ steps, currentStep }: FlowStepperProps) {
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<number[]>([]);

  useEffect(() => {
    const x = positions.current[currentStep - 1] ?? 0;
    scrollRef.current?.scrollTo({ x: Math.max(0, x - spacing.xl), animated: true });
  }, [currentStep]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.stepper}
      accessibilityLabel={`Etapa ${currentStep} de ${steps.length}: ${steps[currentStep - 1]}`}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <View
            key={label}
            style={styles.stepItem}
            onLayout={(event) => {
              positions.current[index] = event.nativeEvent.layout.x;
            }}
          >
            <View style={[styles.circle, (isActive || isDone) && styles.circleActive]}>
              {isDone ? (
                <Ionicons name="checkmark" size={16} color={colors.textInverse} />
              ) : (
                <Text style={[styles.number, isActive && styles.numberActive]}>{stepNumber}</Text>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
            {stepNumber < steps.length ? <View style={styles.line} /> : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepper: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.iconMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  number: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '900',
  },
  numberActive: {
    color: colors.textInverse,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  labelActive: {
    color: colors.primary,
  },
  line: {
    width: 28,
    height: 1,
    backgroundColor: colors.borderStrong,
    marginHorizontal: 10,
  },
});
