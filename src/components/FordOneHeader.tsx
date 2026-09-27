import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAccountSession } from '@/hooks/useAccountSession';
import { colors, radius, spacing, typography } from '@/theme';
import { firstName } from '@/utils/format';
import { goBackOrHome } from '@/utils/navigation';

type FordOneHeaderProps = {
  title?: string;
  subtitle?: string;
  back?: boolean;
  minimal?: boolean;
  accountName?: string | null;
};

export function FordOneHeader({
  title,
  subtitle,
  back = false,
  minimal = false,
  accountName,
}: FordOneHeaderProps) {
  const { profile } = useAccountSession();
  const name = firstName(accountName ?? profile?.name);

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        {back ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            onPress={goBackOrHome}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.navy} />
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ford ONE, ir para o resumo"
          onPress={() => router.navigate('/')}
          style={({ pressed }) => [styles.brandButton, pressed && styles.pressed]}
        >
          <View style={styles.logoOval}>
            <Text style={styles.logoText}>Ford</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.oneText}>ONE</Text>
        </Pressable>

        {minimal ? null : (
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir leads de retenção"
              hitSlop={4}
              onPress={() => router.push('/campanha')}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <Ionicons name="notifications-outline" size={18} color={colors.navy} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={profile ? 'Abrir minha conta' : 'Entrar ou criar conta'}
              onPress={() => router.push('/conta')}
              style={({ pressed }) => [
                styles.avatar,
                !name && styles.avatarIconOnly,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="person-outline" size={17} color={colors.navy} />
              {name ? (
                <Text style={styles.avatarText} numberOfLines={1}>
                  {name}
                </Text>
              ) : null}
            </Pressable>
          </View>
        )}
      </View>

      {title ? (
        <View style={styles.titleBlock}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  brandRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoOval: {
    width: 68,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.navy,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  logoText: {
    color: colors.textInverse,
    fontSize: 17,
    fontStyle: 'italic',
    fontWeight: '900',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderStrong,
  },
  oneText: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: '900',
  },
  headerActions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    minWidth: 82,
    maxWidth: 120,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: 10,
  },
  avatarIconOnly: {
    minWidth: 38,
    width: 38,
    paddingHorizontal: 0,
  },
  avatarText: {
    color: colors.navy,
    fontWeight: '900',
    fontSize: 13,
    flexShrink: 1,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
  titleBlock: {
    gap: 6,
  },
  title: {
    ...typography.display,
  },
  subtitle: {
    ...typography.body,
  },
});
