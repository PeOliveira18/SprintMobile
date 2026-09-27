import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { colors, radius, spacing, typography } from '@/theme';

type ErrorMessageProps = {
  message: string;
  title?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
};

export function ErrorMessage({
  message,
  title = 'Falha ao carregar',
  onRetry,
  fullScreen = false,
}: ErrorMessageProps) {
  const content = (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.header}>
        <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <ActionButton
          label="Tentar novamente"
          icon="refresh-outline"
          onPress={onRetry}
          variant="secondary"
        />
      ) : null}
    </View>
  );

  return fullScreen ? <View style={styles.fullScreen}>{content}</View> : content;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerSoft,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
    color: colors.dangerStrong,
  },
  message: {
    ...typography.body,
    color: colors.dangerStrong,
  },
});
