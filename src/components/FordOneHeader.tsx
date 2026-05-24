import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAccountSession } from '@/hooks/useAccountSession';

type FordOneHeaderProps = {
  title?: string;
  subtitle?: string;
  safeTop?: boolean;
  mode?: 'app' | 'flow';
  accountName?: string | null;
};

export function FordOneHeader({
  title,
  subtitle,
  safeTop = true,
  mode = 'app',
  accountName,
}: FordOneHeaderProps) {
  const insets = useSafeAreaInsets();
  const { profile } = useAccountSession();
  const displayName = accountName ?? profile?.name;
  const firstName = displayName?.trim().split(' ')[0];

  return (
    <View style={[styles.container, safeTop && { paddingTop: insets.top }]}>
      <View style={styles.brandRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir para a home"
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.brandButton, pressed && styles.pressed]}
        >
          <View style={styles.logoOval}>
            <Text style={styles.logoText}>Ford</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.oneText}>ONE</Text>
        </Pressable>
        <View style={styles.headerActions}>
          {mode === 'flow' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sair do fluxo"
              onPress={() => router.replace('/')}
              style={({ pressed }) => [styles.exitButton, pressed && styles.pressed]}
            >
              <Ionicons name="log-out-outline" size={17} color="#001B4D" />
              <Text style={styles.exitText}>Sair</Text>
            </Pressable>
          ) : (
            <>
              <View style={styles.notification}>
                <Ionicons name="notifications-outline" size={18} color="#001B4D" />
                <View style={styles.dot}>
                  <Text style={styles.dotText}>3</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={profile ? 'Abrir minha conta' : 'Cadastrar ou logar'}
                onPress={() => router.push('/conta')}
                style={({ pressed }) => [
                  styles.avatar,
                  !profile && styles.avatarIconOnly,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="person-outline" size={17} color="#001B4D" />
                {firstName ? (
                  <Text style={styles.avatarText} numberOfLines={1}>
                    {firstName}
                  </Text>
                ) : null}
              </Pressable>
            </>
          )}
        </View>
      </View>

      {title ? (
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  brandRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoOval: {
    width: 68,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#064FAE',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#001B4D',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontStyle: 'italic',
    fontWeight: '900',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#C7D3E5',
  },
  oneText: {
    color: '#001B4D',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  headerActions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notification: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE6F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    right: 6,
    top: 5,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#005BEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  avatar: {
    minWidth: 82,
    maxWidth: 104,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8EEF7',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
  },
  avatarIconOnly: {
    minWidth: 38,
    width: 38,
    paddingHorizontal: 0,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  avatarText: {
    color: '#001B4D',
    fontWeight: '900',
    fontSize: 13,
    flexShrink: 1,
  },
  exitButton: {
    minHeight: 38,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
  },
  exitText: {
    color: '#001B4D',
    fontSize: 14,
    fontWeight: '900',
  },
  titleBlock: {
    gap: 6,
  },
  title: {
    color: '#071331',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: '#43516A',
    fontSize: 14,
    lineHeight: 20,
  },
});
