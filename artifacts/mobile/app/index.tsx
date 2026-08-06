import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import BreathingCircle from '@/components/BreathingCircle';
import BackgroundGradient from '@/components/BackgroundGradient';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(1)).current;

  const handleGroundMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 120, useNativeDriver: Platform.OS !== 'web', easing: Easing.out(Easing.quad) }),
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== 'web', easing: Easing.out(Easing.quad) }),
    ]).start(() => router.push('/grounding'));
  };

  const navItems = [
    { icon: 'message-circle' as const, label: 'Companion', route: '/chat' },
    { icon: 'wind' as const, label: 'Breathe', route: '/audio' },
    { icon: 'edit-3' as const, label: 'Log', route: '/log' },
    { icon: 'settings' as const, label: 'Settings', route: '/settings' },
  ];

  return (
    <BackgroundGradient
      style={[
        styles.container,
        {
          paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0),
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0),
        },
      ]}
    >
      {/* Wordmark */}
      <View style={styles.wordmark}>
        <Text style={[styles.wordmarkText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
          cuan
        </Text>
      </View>

      {/* Center — Ground Me Button */}
      <View style={styles.centerArea}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable onPress={handleGroundMe} style={styles.groundMePress} testID="ground-me-button">
            <BreathingCircle size={220} active>
              <View style={styles.buttonContent}>
                <Text style={[styles.groundMeText, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
                  Ground Me
                </Text>
              </View>
            </BreathingCircle>
          </Pressable>
        </Animated.View>

        <Text style={[styles.hint, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          tap when you need it
        </Text>
        
        <Text style={[styles.jessicaMessage, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          always here for you, jessica ❤️
        </Text>
      </View>

      {/* Bottom Nav */}
      <View
        style={[
          styles.bottomNav,
          {
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          },
        ]}
      >
        {navItems.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(item.route as any);
            }}
            style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.5 : 1 }]}
          >
            <Feather name={item.icon} size={22} color={colors.mutedForeground} />
            <Text style={[styles.navLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  wordmark: {
    paddingTop: 20,
    paddingBottom: 0,
    alignSelf: 'center',
  },
  wordmarkText: {
    fontSize: 14,
    letterSpacing: 4,
    textTransform: 'lowercase',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  groundMePress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  groundMeText: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 13,
    letterSpacing: 1,
  },
  jessicaMessage: {
    fontSize: 12,
    letterSpacing: 0.5,
    marginTop: 20,
    opacity: 0.6,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    paddingTop: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
