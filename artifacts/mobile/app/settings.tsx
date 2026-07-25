import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
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

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useAnchor();
  const [name, setName] = useState(settings.emergencyContactName);
  const [phone, setPhone] = useState(settings.emergencyContactPhone);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(settings.emergencyContactName);
    setPhone(settings.emergencyContactPhone);
  }, [settings]);

  async function handleSave() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateSettings({ emergencyContactName: name.trim(), emergencyContactPhone: phone.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function callEmergencyContact() {
    if (!settings.emergencyContactPhone) return;
    Linking.openURL(`tel:${settings.emergencyContactPhone}`);
  }

  const topPadding = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const bottomPadding = insets.bottom + (Platform.OS === 'web' ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPadding }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Feather name="arrow-left" size={22} color={colors.mutedForeground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
          Settings
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPadding + 40 }]}
      >
        {/* Emergency Contact */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            Emergency Contact
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Mom"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]}
            autoCapitalize="words"
          />
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            Phone number
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 555 000 0000"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, fontFamily: 'Inter_400Regular' }]}
            keyboardType="phone-pad"
          />
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: saved ? colors.success : colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={[styles.saveBtnText, { color: '#07090f', fontFamily: 'Inter_600SemiBold' }]}>
              {saved ? 'Saved' : 'Save Contact'}
            </Text>
          </Pressable>
        </View>

        {settings.emergencyContactPhone ? (
          <Pressable
            onPress={callEmergencyContact}
            style={({ pressed }) => [
              styles.callBtn,
              { backgroundColor: colors.destructive, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="phone-call" size={18} color="#ffffff" />
            <Text style={[styles.callBtnText, { fontFamily: 'Inter_600SemiBold' }]}>
              Call {settings.emergencyContactName || 'Emergency Contact'}
            </Text>
          </Pressable>
        ) : null}

        {/* Crisis Resources */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            Crisis Resources
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, gap: 12 }]}>
          {[
            { name: '988 Suicide & Crisis Lifeline', number: '988', note: 'Call or text in the US' },
            { name: 'Crisis Text Line', number: 'sms:741741', note: 'Text HOME to 741741' },
            { name: 'International Association for Suicide Prevention', number: 'https://www.iasp.info/resources/Crisis_Centres/', note: 'Find a crisis centre worldwide' },
          ].map((r) => (
            <Pressable
              key={r.name}
              onPress={() => Linking.openURL(r.number.startsWith('http') ? r.number : `tel:${r.number}`)}
              style={({ pressed }) => [styles.resourceRow, { opacity: pressed ? 0.6 : 1 }]}
            >
              <View style={styles.resourceInfo}>
                <Text style={[styles.resourceName, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
                  {r.name}
                </Text>
                <Text style={[styles.resourceNote, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  {r.note}
                </Text>
              </View>
              <Feather name="external-link" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        {/* About */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            About
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.aboutTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            Anchor
          </Text>
          <Text style={[styles.aboutText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            A sanctuary for people experiencing Depersonalization-Derealization Disorder and severe panic attacks.
          </Text>
          <Text style={[styles.aboutText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            This app is not a substitute for professional medical care. If you are in crisis, please contact a mental health professional or your emergency services.
          </Text>
          <Text style={[styles.version, { color: colors.border, fontFamily: 'Inter_400Regular' }]}>
            Version 1.0.0
          </Text>
        </View>
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
  scroll: { paddingHorizontal: 20, gap: 0, paddingTop: 8 },
  sectionHeader: { paddingHorizontal: 4, paddingTop: 20, paddingBottom: 8 },
  sectionTitle: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  fieldLabel: { fontSize: 12 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  saveBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveBtnText: { fontSize: 15 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 54,
    borderRadius: 27,
    marginTop: 12,
  },
  callBtnText: { fontSize: 16, color: '#ffffff' },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  resourceInfo: { flex: 1, gap: 2 },
  resourceName: { fontSize: 14 },
  resourceNote: { fontSize: 12 },
  aboutTitle: { fontSize: 18, marginBottom: 4 },
  aboutText: { fontSize: 13, lineHeight: 21 },
  version: { fontSize: 11, marginTop: 4 },
});
