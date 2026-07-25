import React, { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import ChatBubble from '@/components/ChatBubble';
import { useAnchor } from '@/context/AnchorContext';
import {
  companionFallbackResponses,
  companionResponses,
} from '@/data/groundingContent';

function getCompanionReply(input: string): string {
  const lower = input.toLowerCase();
  for (const group of companionResponses) {
    if (group.keywords.some((kw) => lower.includes(kw))) {
      const pool = group.responses;
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return companionFallbackResponses[
    Math.floor(Math.random() * companionFallbackResponses.length)
  ];
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chatHistory, addChatMessage, clearChat } = useAnchor();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const topPadding = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  function sendMessage() {
    const text = input.trim();
    if (!text || typing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    addChatMessage({ role: 'user', content: text });
    setTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      addChatMessage({ role: 'companion', content: getCompanionReply(text) });
      setTyping(false);
    }, delay);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPadding }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Feather name="arrow-left" size={22} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
            Companion
          </Text>
        </View>
        <Pressable
          onPress={() => { Haptics.selectionAsync(); clearChat(); }}
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Feather name="rotate-ccw" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={[...chatHistory].reverse()}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            typing ? (
              <View style={styles.typingRow}>
                <View style={[styles.typingBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.typingDots, { color: colors.mutedForeground }]}>
                    · · ·
                  </Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              borderTopColor: colors.border,
              paddingBottom: bottomInset,
              backgroundColor: colors.background,
            },
          ]}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tell me how you're feeling..."
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.textInput,
              { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border, fontFamily: 'Inter_400Regular' },
            ]}
            multiline
            maxLength={400}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit
          />
          <Pressable
            onPress={sendMessage}
            disabled={!input.trim() || typing}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: input.trim() && !typing ? colors.primary : colors.muted,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            testID="send-message"
          >
            <Feather name="arrow-up" size={18} color={input.trim() && !typing ? colors.primaryForeground : colors.mutedForeground} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  headerTitle: { fontSize: 16 },
  messageList: {
    paddingVertical: 16,
    gap: 2,
  },
  typingRow: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  typingDots: { fontSize: 20, letterSpacing: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});
