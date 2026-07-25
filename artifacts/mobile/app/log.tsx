import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useAnchor } from '@/context/AnchorContext';

const SLEEP_OPTIONS = [4, 5, 6, 7, 8, 9, 10, 11, 12];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function stressColor(level: number): string {
  if (level <= 3) return '#81c995';
  if (level <= 6) return '#f4a261';
  return '#e57373';
}

export default function LogScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { logs, addLog } = useAnchor();
  const [stress, setStress] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addLog({ stressLevel: stress, sleepHours: sleep, notes: notes.trim() });
    setNotes('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

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
          Daily Check-in
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPadding + 40 }]}
      >
        {/* Stress */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            Stress level
          </Text>
          <Text style={[styles.sectionValue, { color: stressColor(stress), fontFamily: 'Inter_700Bold' }]}>
            {stress}
          </Text>
          <View style={styles.stressRow}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <Pressable
                key={n}
                onPress={() => { Haptics.selectionAsync(); setStress(n); }}
                style={[
                  styles.stressBtn,
                  {
                    backgroundColor: n <= stress ? stressColor(stress) : colors.muted,
                    borderColor: n === stress ? stressColor(stress) : 'transparent',
                  },
                ]}
              >
                <Text style={[styles.stressBtnText, { color: n <= stress ? '#07090f' : colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.stressLabels}>
            <Text style={[styles.stressLabelText, { color: colors.success, fontFamily: 'Inter_400Regular' }]}>calm</Text>
            <Text style={[styles.stressLabelText, { color: colors.destructive, fontFamily: 'Inter_400Regular' }]}>intense</Text>
          </View>
        </View>

        {/* Sleep */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            Sleep last night
          </Text>
          <Text style={[styles.sectionValue, { color: colors.accent, fontFamily: 'Inter_700Bold' }]}>
            {sleep}h
          </Text>
          <View style={styles.sleepRow}>
            {SLEEP_OPTIONS.map((h) => (
              <Pressable
                key={h}
                onPress={() => { Haptics.selectionAsync(); setSleep(h); }}
                style={[
                  styles.sleepBtn,
                  {
                    backgroundColor: h === sleep ? colors.accent : colors.muted,
                    borderColor: h === sleep ? colors.accent : 'transparent',
                  },
                ]}
              >
                <Text style={[styles.sleepBtnText, { color: h === sleep ? '#07090f' : colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>
                  {h}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            How are you feeling?
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Write freely. This is just for you."
            placeholderTextColor={colors.mutedForeground}
            multiline
            style={[
              styles.notesInput,
              { color: colors.foreground, fontFamily: 'Inter_400Regular', borderColor: colors.border },
            ]}
          />
        </View>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveBtn,
            {
              backgroundColor: saved ? colors.success : colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          testID="save-log"
        >
          <Text style={[styles.saveBtnText, { color: '#07090f', fontFamily: 'Inter_600SemiBold' }]}>
            {saved ? 'Saved' : 'Save Check-in'}
          </Text>
        </Pressable>

        {/* History */}
        {logs.length > 0 && (
          <View style={styles.historySection}>
            <Text style={[styles.historyTitle, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              History
            </Text>
            {logs.map((log) => (
              <View
                key={log.id}
                style={[styles.logCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.logHeader}>
                  <Text style={[styles.logDate, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                    {formatDate(log.createdAt)}
                  </Text>
                  <View style={styles.logPills}>
                    <View style={[styles.pill, { backgroundColor: `${stressColor(log.stressLevel)}22` }]}>
                      <Text style={[styles.pillText, { color: stressColor(log.stressLevel), fontFamily: 'Inter_600SemiBold' }]}>
                        {log.stressLevel}/10
                      </Text>
                    </View>
                    <View style={[styles.pill, { backgroundColor: colors.accentDim }]}>
                      <Text style={[styles.pillText, { color: colors.accent, fontFamily: 'Inter_600SemiBold' }]}>
                        {log.sleepHours}h
                      </Text>
                    </View>
                  </View>
                </View>
                {log.notes.length > 0 && (
                  <Text style={[styles.logNotes, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
                    {log.notes}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  scroll: { paddingHorizontal: 20, gap: 14, paddingTop: 8 },
  section: {
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  sectionLabel: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  sectionValue: { fontSize: 36 },
  stressRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  stressBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  stressBtnText: { fontSize: 12 },
  stressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  stressLabelText: { fontSize: 11 },
  sleepRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  sleepBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1.5,
  },
  sleepBtnText: { fontSize: 13 },
  notesInput: {
    minHeight: 100,
    fontSize: 15,
    lineHeight: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    textAlignVertical: 'top',
  },
  saveBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { fontSize: 16 },
  historySection: { gap: 10, marginTop: 8 },
  historyTitle: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  logCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logDate: { fontSize: 12 },
  logPills: { flexDirection: 'row', gap: 6 },
  pill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 12 },
  logNotes: { fontSize: 14, lineHeight: 21 },
});
