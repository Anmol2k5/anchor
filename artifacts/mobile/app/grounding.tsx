import React, { useEffect, useRef, useState } from 'react';
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
import { groundingSteps } from '@/data/groundingContent';

type Phase = 'intro' | 'step' | 'complete';

const SENSE_COLORS: Record<string, string> = {
  SEE: '#6baed6',
  TOUCH: '#9b8fd4',
  HEAR: '#74c69d',
  SMELL: '#f4a261',
  TASTE: '#e76f51',
};

export default function GroundingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const completeScale = useRef(new Animated.Value(0.8)).current;
  const completeOpacity = useRef(new Animated.Value(0)).current;

  const currentStep = groundingSteps[stepIndex];

  function fadeTransition(callback: () => void) {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    });
  }

  function handleBegin() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fadeTransition(() => {
      setPhase('step');
      setStepIndex(0);
    });
  }

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stepIndex < groundingSteps.length - 1) {
      fadeTransition(() => setStepIndex((i) => i + 1));
    } else {
      fadeTransition(() => {
        setPhase('complete');
        Animated.parallel([
          Animated.spring(completeScale, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(completeOpacity, { toValue: 1, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
        ]).start();
      });
    }
  }

  const topPadding = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const bottomPadding = insets.bottom + (Platform.OS === 'web' ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPadding, paddingBottom: bottomPadding }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.5 : 1 }]}
          testID="close-grounding"
        >
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>

        {phase === 'step' && (
          <Text style={[styles.stepCounter, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {stepIndex + 1} / {groundingSteps.length}
          </Text>
        )}
      </View>

      {/* Step dots */}
      {phase === 'step' && (
        <View style={styles.dots}>
          {groundingSteps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i <= stepIndex ? colors.primary : colors.border,
                  width: i === stepIndex ? 20 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {phase === 'intro' && (
          <View style={styles.introContent}>
            <BreathingCircle size={200} active>
              <Text style={[styles.introIcon, { color: colors.primary, fontFamily: 'Inter_400Regular' }]}>
                ∾
              </Text>
            </BreathingCircle>
            <Text style={[styles.introTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              Let's come back{'\n'}to the present.
            </Text>
            <Text style={[styles.introSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              This exercise takes about two minutes.{'\n'}Find a comfortable position.
            </Text>
          </View>
        )}

        {phase === 'step' && currentStep && (
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.senseWord,
                { color: SENSE_COLORS[currentStep.sense] ?? colors.primary, fontFamily: 'Inter_700Bold' },
              ]}
            >
              {currentStep.sense}
            </Text>
            <BreathingCircle size={180} active color={SENSE_COLORS[currentStep.sense] ?? colors.primary}>
              <Text style={[styles.countText, { color: SENSE_COLORS[currentStep.sense] ?? colors.primary, fontFamily: 'Inter_700Bold' }]}>
                {currentStep.count}
              </Text>
            </BreathingCircle>
            <Text style={[styles.stepPrompt, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
              {currentStep.prompt}
            </Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {currentStep.subPrompt}
            </Text>
            <Text style={[styles.breathText, { color: colors.accent, fontFamily: 'Inter_400Regular' }]}>
              {currentStep.breathInstruction}
            </Text>
          </View>
        )}

        {phase === 'complete' && (
          <Animated.View
            style={[styles.completeContent, { opacity: completeOpacity, transform: [{ scale: completeScale }] }]}
          >
            <BreathingCircle size={200} active color={colors.success}>
              <Feather name="check" size={36} color={colors.success} />
            </BreathingCircle>
            <Text style={[styles.completeTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
              You did it.
            </Text>
            <Text style={[styles.completeSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              You are here. You are real.{'\n'}Take a moment to feel the calm.
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Bottom Button */}
      <View style={styles.bottomArea}>
        {phase === 'intro' && (
          <Pressable
            onPress={handleBegin}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            testID="begin-grounding"
          >
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground, fontFamily: 'Inter_600SemiBold' }]}>
              Begin
            </Text>
          </Pressable>
        )}

        {phase === 'step' && (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            testID="next-step"
          >
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground, fontFamily: 'Inter_600SemiBold' }]}>
              {stepIndex < groundingSteps.length - 1 ? "I'm ready" : 'Complete'}
            </Text>
          </Pressable>
        )}

        {phase === 'complete' && (
          <View style={styles.completeButtons}>
            <Pressable
              onPress={() => {
                setPhase('intro');
                setStepIndex(0);
                fadeAnim.setValue(1);
                completeScale.setValue(0.8);
                completeOpacity.setValue(0);
              }}
              style={({ pressed }) => [
                styles.secondaryBtn,
                { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.secondaryBtnText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
                Again
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground, fontFamily: 'Inter_600SemiBold' }]}>
                Done
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  closeBtn: {
    padding: 8,
  },
  stepCounter: {
    fontSize: 13,
    letterSpacing: 1,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introContent: {
    alignItems: 'center',
    gap: 32,
    paddingHorizontal: 32,
  },
  introIcon: {
    fontSize: 40,
  },
  introTitle: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 38,
  },
  introSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepContent: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 32,
  },
  senseWord: {
    fontSize: 11,
    letterSpacing: 5,
    textTransform: 'uppercase',
  },
  countText: {
    fontSize: 48,
    fontWeight: '700' as const,
  },
  stepPrompt: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 32,
  },
  stepSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  breathText: {
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  completeContent: {
    alignItems: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  completeTitle: {
    fontSize: 32,
    textAlign: 'center',
  },
  completeSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomArea: {
    paddingHorizontal: 28,
    paddingBottom: 24,
    paddingTop: 12,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 16,
  },
  completeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});
