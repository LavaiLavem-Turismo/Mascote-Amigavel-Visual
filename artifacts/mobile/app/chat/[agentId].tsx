import { AGENTS } from "@/constants/agents";
import type { AgentDef } from "@/constants/agents";
import { useColors } from "@/hooks/useColors";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WHATSAPP_NUMBER = "5584999999999";
const WHATSAPP_MESSAGE = "Olá! Vim pelo app da La Vai La Vem Turismo e gostaria de mais informações.";

function ChatBubble({
  message,
  agent,
  colors,
}: {
  message: Message;
  agent: AgentDef;
  colors: ReturnType<typeof useColors>;
}) {
  const isUser = message.role === "user";

  const cleanContent = message.content
    .replace(/\|\|\|CHIPS:\[.*?\]\|\|\|/g, "")
    .replace(/\|\|\|RESUMO:\{.*?\}\|\|\|/g, "")
    .replace(/\|\|\|SUPORTE:\{.*?\}\|\|\|/g, "")
    .trim();

  return (
    <View
      style={[
        styles.bubbleRow,
        isUser ? styles.bubbleRowUser : styles.bubbleRowAgent,
      ]}
    >
      {!isUser && (
        <View
          style={[
            styles.agentAvatar,
            {
              borderColor: `rgba(${agent.colorRgb}, 0.5)`,
              shadowColor: agent.color,
            },
          ]}
        >
          <Image source={agent.image} style={styles.agentAvatarImg} resizeMode="cover" />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: agent.color }]
            : [styles.agentBubble, { backgroundColor: colors.card, borderColor: `rgba(${agent.colorRgb}, 0.2)` }],
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? "#ffffff" : colors.foreground },
          ]}
        >
          {cleanContent}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator({ agent, colors }: { agent: AgentDef; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.bubbleRow}>
      <View
        style={[
          styles.agentAvatar,
          { borderColor: `rgba(${agent.colorRgb}, 0.5)` },
        ]}
      >
        <Image source={agent.image} style={styles.agentAvatarImg} resizeMode="cover" />
      </View>
      <View
        style={[
          styles.bubble,
          styles.agentBubble,
          {
            backgroundColor: colors.card,
            borderColor: `rgba(${agent.colorRgb}, 0.2)`,
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
        ]}
      >
        <ActivityIndicator size="small" color={agent.color} />
      </View>
    </View>
  );
}

function QuickChip({
  label,
  onPress,
  agent,
  colors,
}: {
  label: string;
  onPress: () => void;
  agent: AgentDef;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: `rgba(${agent.colorRgb}, 0.1)`,
          borderColor: `rgba(${agent.colorRgb}, 0.35)`,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text style={[styles.chipText, { color: agent.color }]}>{label}</Text>
    </Pressable>
  );
}

export default function ChatScreen() {
  const { agentId } = useLocalSearchParams<{ agentId: string }>();
  const agent = AGENTS.find((a) => a.id === agentId) ?? AGENTS[0];
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: agent.welcomeText,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chips, setChips] = useState<string[]>(agent.welcomeChips);

  const extractChips = (text: string): string[] => {
    const match = text.match(/\|\|\|CHIPS:\[(.*?)\]\|\|\|/);
    if (!match) return [];
    try {
      return JSON.parse(`[${match[1]}]`);
    } catch {
      return [];
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        role: "user",
        content: text.trim(),
      };

      const currentMessages = [...messages, userMessage];
      setMessages(currentMessages);
      setInput("");
      setChips([]);
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        const domain = process.env.EXPO_PUBLIC_DOMAIN;
        const baseUrl = domain ? `https://${domain}` : "";
        const apiMessages = currentMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, agent: agent.id }),
        });

        if (!response.ok) throw new Error("API error");

        const data = (await response.json()) as { content: string };
        const assistantMessage: Message = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          role: "assistant",
          content: data.content,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        const newChips = extractChips(data.content);
        if (newChips.length > 0) setChips(newChips);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        const errorMessage: Message = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          role: "assistant",
          content: "Ops! Tive um probleminha de conexão. Tenta de novo?",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [messages, isLoading, agent.id]
  );

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`);
    });
  };

  const reversedMessages = [...messages].reverse();

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <ChatBubble message={item} agent={agent} colors={colors} />
    ),
    [agent, colors]
  );

  const headerBottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={agent.gradient}
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === "web" ? 67 : insets.top + 8,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          testID="back-button"
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Image source={agent.image} style={styles.headerAvatarImg} resizeMode="cover" />
          </View>
          <View>
            <Text style={styles.headerName}>{agent.name}</Text>
            <Text style={styles.headerRole}>{agent.role}</Text>
          </View>
        </View>

        <Pressable onPress={openWhatsApp} style={styles.whatsappButton} testID="whatsapp-button">
          <Ionicons name="logo-whatsapp" size={22} color="#ffffff" />
        </Pressable>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={reversedMessages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: 8 },
          ]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            isLoading ? (
              <TypingIndicator agent={agent} colors={colors} />
            ) : chips.length > 0 ? (
              <View style={styles.chipsContainer}>
                {chips.map((chip) => (
                  <QuickChip
                    key={chip}
                    label={chip}
                    onPress={() => sendMessage(chip)}
                    agent={agent}
                    colors={colors}
                  />
                ))}
              </View>
            ) : null
          }
        />

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: headerBottomPadding + 8,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                backgroundColor: colors.muted,
                color: colors.foreground,
                borderColor: `rgba(${agent.colorRgb}, 0.3)`,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            testID="chat-input"
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={({ pressed }) => [
              styles.sendButton,
              {
                opacity: !input.trim() || isLoading ? 0.4 : pressed ? 0.7 : 1,
              },
            ]}
            testID="send-button"
          >
            <LinearGradient
              colors={agent.gradient}
              style={styles.sendGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="send" size={18} color="#ffffff" />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  headerAvatarImg: {
    width: "100%",
    height: "100%",
  },
  headerName: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  headerRole: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  whatsappButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  messageList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 10,
    flexGrow: 1,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 4,
  },
  bubbleRowUser: {
    justifyContent: "flex-end",
  },
  bubbleRowAgent: {
    justifyContent: "flex-start",
  },
  agentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    backgroundColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexShrink: 0,
  },
  agentAvatarImg: {
    width: "100%",
    height: "100%",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    justifyContent: "flex-end",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    flexShrink: 0,
  },
  sendGradient: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
