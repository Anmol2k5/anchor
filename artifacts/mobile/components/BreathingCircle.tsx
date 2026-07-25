import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface BreathingCircleProps {
  size?: number;
  children?: React.ReactNode;
  active?: boolean;
  color?: string;
}

export default function BreathingCircle({
  size = 220,
  children,
  active = true,
  color,
}: BreathingCircleProps) {
  const colors = useColors();
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const ringColor = color ?? colors.primary;

  useEffect(() => {
    if (!active) return;

    const makeRingAnim = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 3600,
              easing: Easing.out(Easing.quad),
              useNativeDriver: Platform.OS !== 'web',
            }),
          ]),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );

    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          toValue: 0.96,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const r1 = makeRingAnim(ring1, 0);
    const r2 = makeRingAnim(ring2, 1200);
    const r3 = makeRingAnim(ring3, 2400);

    r1.start();
    r2.start();
    r3.start();
    pulseAnim.start();

    return () => {
      r1.stop();
      r2.stop();
      r3.stop();
      pulseAnim.stop();
    };
  }, [active, ring1, ring2, ring3, pulse]);

  const makeRingStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.5, 0] }),
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }),
      },
    ],
  });

  return (
    <View style={[styles.container, { width: size * 1.8, height: size * 1.8 }]}>
      {/* Animated rings */}
      {[ring1, ring2, ring3].map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: ringColor,
            },
            makeRingStyle(anim),
          ]}
        />
      ))}

      {/* Core circle */}
      <Animated.View
        style={[
          styles.core,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'rgba(107, 174, 214, 0.08)',
            borderColor: ringColor,
            transform: [{ scale: pulse }],
          },
        ]}
      >
        <View
          style={[
            styles.innerCore,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: (size * 0.7) / 2,
              backgroundColor: 'rgba(107, 174, 214, 0.06)',
            },
          ]}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  core: {
    position: 'absolute',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCore: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
