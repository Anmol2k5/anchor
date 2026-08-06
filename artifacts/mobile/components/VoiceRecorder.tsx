import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VoiceRecorder() {
  const colors = useColors();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [savedUri, setSavedUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('custom_voice_uri');
      if (saved) setSavedUri(saved);
      
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  async function startRecording() {
    try {
      if (hasPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    if (uri) {
      setSavedUri(uri);
      await AsyncStorage.setItem('custom_voice_uri', uri);
    }
  }

  async function playSaved() {
    if (!savedUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: savedUri });
    await sound.playAsync();
  }

  async function deleteVoice() {
    setSavedUri(null);
    await AsyncStorage.removeItem('custom_voice_uri');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
        Custom Breathing Guide
      </Text>
      <Text style={[styles.desc, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
        Record your own voice to play during breathing exercises.
      </Text>

      {savedUri ? (
        <View style={styles.savedRow}>
          <Pressable onPress={playSaved} style={[styles.playBtn, { backgroundColor: colors.primaryDim }]}>
            <Feather name="play" size={16} color={colors.primary} />
            <Text style={{ color: colors.primary, fontFamily: 'Inter_500Medium' }}>Play Voice</Text>
          </Pressable>
          <Pressable onPress={deleteVoice} style={[styles.deleteBtn, { backgroundColor: colors.destructive + '20' }]}>
            <Feather name="trash" size={16} color={colors.destructive} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopRecording}
          style={({ pressed }) => [
            styles.recordBtn,
            { backgroundColor: recording ? colors.destructive : colors.primary },
            pressed && styles.pressed
          ]}
        >
          <Feather name="mic" size={18} color={recording ? '#fff' : '#07090f'} />
          <Text style={[styles.recordText, { color: recording ? '#fff' : '#07090f', fontFamily: 'Inter_600SemiBold' }]}>
            {recording ? 'Recording... (Release to save)' : 'Hold to Record Voice'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    gap: 12,
  },
  title: { fontSize: 15 },
  desc: { fontSize: 13, lineHeight: 20 },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    marginTop: 4,
  },
  recordText: { fontSize: 14 },
  pressed: { opacity: 0.8 },
  savedRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
