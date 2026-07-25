import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { companionGreeting } from '@/data/groundingContent';

export interface DailyLog {
  id: string;
  stressLevel: number;
  sleepHours: number;
  notes: string;
  createdAt: string;
}

export interface AppSettings {
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'companion';
  content: string;
  timestamp: string;
}

interface AnchorContextType {
  logs: DailyLog[];
  settings: AppSettings;
  chatHistory: ChatMessage[];
  addLog: (log: Omit<DailyLog, 'id' | 'createdAt'>) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
}

const defaultSettings: AppSettings = {
  emergencyContactName: '',
  emergencyContactPhone: '',
};

const STORAGE_KEYS = {
  LOGS: '@anchor:logs',
  SETTINGS: '@anchor:settings',
  CHAT: '@anchor:chat',
};

const AnchorContext = createContext<AnchorContextType | null>(null);

export function AnchorProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'companion',
      content: companionGreeting,
      timestamp: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [logsStr, settingsStr, chatStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LOGS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.CHAT),
      ]);
      if (logsStr) setLogs(JSON.parse(logsStr));
      if (settingsStr) setSettings({ ...defaultSettings, ...JSON.parse(settingsStr) });
      if (chatStr) {
        const saved: ChatMessage[] = JSON.parse(chatStr);
        if (saved.length > 0) setChatHistory(saved);
      }
    } catch {
      // Graceful degradation — app still works without persisted data
    }
  }

  async function addLog(log: Omit<DailyLog, 'id' | 'createdAt'>) {
    const newLog: DailyLog = {
      ...log,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  }

  async function updateSettings(partial: Partial<AppSettings>) {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  }

  function addChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const newMsg: ChatMessage = {
      ...msg,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => {
      const updated = [...prev, newMsg];
      AsyncStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }

  function clearChat() {
    const fresh: ChatMessage[] = [
      {
        id: 'greeting',
        role: 'companion',
        content: companionGreeting,
        timestamp: new Date().toISOString(),
      },
    ];
    setChatHistory(fresh);
    AsyncStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(fresh)).catch(() => {});
  }

  return (
    <AnchorContext.Provider
      value={{ logs, settings, chatHistory, addLog, updateSettings, addChatMessage, clearChat }}
    >
      {children}
    </AnchorContext.Provider>
  );
}

export function useAnchor() {
  const ctx = useContext(AnchorContext);
  if (!ctx) throw new Error('useAnchor must be used within AnchorProvider');
  return ctx;
}
