import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
import { audioExercises, type AudioExercise } from '@/data/groundingContent';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfter';

export default function AudioScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeExercise, setActiveExercise] = useState<AudioExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const breathScale = useRef(new Animated.Value(0.8)).current;
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseLabel: Record<BreathPhase, string> = {
    inhale: 'breathe in',
    hold: 'hold',
    exhale: 'breathe out',
    holdAfter: 'hold',
  };

  function startExercise(ex: AudioExercise) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveExercise(ex);
    setIsPlaying(true);
    setCycleCount(0);
    setBreathPhase('inhale');
    runPhase('inhale', ex, 0);
  }

  function runPhase(phase: BreathPhase, ex: AudioExercise, count: number) {
    const durations: Record<BreathPhase, number> = {
      inhale: ex.breathPattern.inhale,
      hold: ex.breathPattern.hold ?? 0,
      exhale: ex.breathPattern.exhale,
      holdAfter: ex.breathPattern.holdAfter ?? 0,
    };
    const dur = durations[phase] * 1000;
    if (dur === 0) {
      const next = nextPhase(phase);
      const newCount = next === 'inhale' ? count + 1 : count;
      if (newCount >= ex.cycles && next === 'inhale') {
        setIsPlaying(false);
        return;
      }
      setBreathPhase(next);
      setCycleCount(newCount);
      runPhase(next, ex, newCount);
      return;
    }

    const toValue = phase === 'inhale' ? 1.15 : phase === 'exhale' ? 0.8 : breathScale._value;
    Animated.timing(breathScale, {
      toValue,
      duration: dur,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    phaseTimer.current = setTimeout(() => {
      const next = nextPhase(phase);
      const newCount = next === 'inhale' ? count + 1 : count;
      if (newCount >= ex.cycles && next === 'inhale') {
        setIsPlaying(false);
        setBreathPhase('inhale');
        return;
      }
      setBreathPhase(next);
      setCycleCount(newCount);
      runPhase(next, ex, newCount);
    }, dur);
  }

  function nextPhase(phase: BreathPhase): BreathPhase {
    if (phase === 'inhale') return 'hold';
    if (phase === 'hold') return 'exhale';
    if (phase === 'exhale') return 'holdAfter';
    return 'inhale';
  }

  function stopExercise() {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    breathScale.stopAnimation();
    setIsPlaying(false);
    setActiveExercise(null);
  }

  useEffect(() => () => { if (phaseTimer.current) clearTimeout(phaseTimer.current); }, []);

  const topPadding = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const bottomPadding = insets.bottom + (Platform.OS === 'web' ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPadding }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Feather name="arrow-left" size={22} color={colors.mutedForeground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
          Breathe
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: bottomPadding + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {audioExercises.map((ex) => (
          <Pressable
            key={ex.id}
            onPress={() => startExercise(ex)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardLeft}>
                <Text style={[styles.exerciseTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                  {ex.title}
                </Text>
                <Text style={[styles.duration, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  {ex.duration}
                </Text>
              </View>
              <View style={[styles.playBtn, { backgroundColor: colors.primaryDim }]}>
                <Feather name="play" size={18} color={colors.primary} />
              </View>
            </View>
            <Text style={[styles.description, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {ex.description}
            </Text>
            <View style={styles.patternRow}>
              {[
                { label: `${ex.breathPattern.inhale}s`, sub: 'in' },
                ...(ex.breathPattern.hold ? [{ label: `${ex.breathPattern.hold}s`, sub: 'hold' }] : []),
                { label: `${ex.breathPattern.exhale}s`, sub: 'out' },
                ...(ex.breathPattern.holdAfter ? [{ label: `${ex.breathPattern.holdAfter}s`, sub: 'hold' }] : []),
              ].map((p, i) => (
                <View key={i} style={[styles.patternPill, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.patternNum, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>{p.label}</Text>
                  <Text style={[styles.patternSub, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>{p.sub}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Breathing Modal */}
      <Modal visible={!!activeExercise} transparent animationType="fade">
        <View style={[styles.modalBg, { backgroundColor: colors.background }]}>
          {activeExercise && (
            <>
              <Text style={[styles.modalTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                {activeExercise.title}
              </Text>
              <Text style={[styles.cycleLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                {isPlaying ? `Cycle ${cycleCount + 1} of ${activeExercise.cycles}` : 'Complete'}
              </Text>

              <View style={styles.modalCircle}>
                <Animated.View style={{ transform: [{ scale: breathScale }] }}>
                  <BreathingCircle size={200} active={isPlaying}>
                    <Text style={[styles.phaseText, { color: colors.primary, fontFamily: 'Inter_400Regular' }]}>
                      {isPlaying ? phaseLabel[breathPhase] : '✓'}
                    </Text>
                  </BreathingCircle>
                </Animated.View>
              </View>

              <Pressable
                onPress={stopExercise}
                style={({ pressed }) => [
                  styles.stopBtn,
                  { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={[styles.stopBtnText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
                  {isPlaying ? 'Stop' : 'Close'}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 17 },
  list: { paddingHorizontal: 20, gap: 14, paddingTop: 8 },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardLeft: { flex: 1, gap: 2 },
  exerciseTitle: { fontSize: 16 },
  duration: { fontSize: 12 },
  playBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  description: { fontSize: 13, lineHeight: 20 },
  patternRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  patternPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center' },
  patternNum: { fontSize: 14 },
  patternSub: { fontSize: 10 },
  modalBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  modalTitle: { fontSize: 22 },
  cycleLabel: { fontSize: 14 },
  modalCircle: { marginVertical: 24 },
  phaseText: { fontSize: 15, letterSpacing: 1 },
  stopBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
    marginTop: 16,
  },
  stopBtnText: { fontSize: 15 },
});
