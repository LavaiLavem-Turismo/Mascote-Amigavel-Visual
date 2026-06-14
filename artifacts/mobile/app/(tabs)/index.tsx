import { AGENTS } from "@/constants/agents";
import type { AgentDef } from "@/constants/agents";
import { useColors } from "@/hooks/useColors";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

function AgentCard({ agent, index }: { agent: AgentDef; index: number }) {
  const colors = useColors();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000 + index * 300,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000 + index * 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/chat/${agent.id}`);
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: `rgba(${agent.colorRgb}, 0.3)`,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <LinearGradient
          colors={[`rgba(${agent.colorRgb}, 0.08)`, "transparent"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.cardContent}>
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                borderColor: `rgba(${agent.colorRgb}, 0.5)`,
                shadowColor: agent.color,
                transform: [{ translateY: floatTranslate }],
              },
            ]}
          >
            <Image
              source={agent.image}
              style={styles.avatar}
              resizeMode="cover"
            />
          </Animated.View>

          <View style={styles.textContent}>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: `rgba(${agent.colorRgb}, 0.15)`,
                  borderColor: `rgba(${agent.colorRgb}, 0.35)`,
                },
              ]}
            >
              <Text style={[styles.roleText, { color: agent.color }]}>
                {agent.role}
              </Text>
            </View>

            <Text style={[styles.agentName, { color: colors.foreground }]}>
              {agent.name}
            </Text>
            <Text style={[styles.agentTagline, { color: colors.mutedForeground }]}>
              {agent.tagline}
            </Text>
          </View>

          <LinearGradient
            colors={agent.gradient}
            style={styles.ctaButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Conversar</Text>
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function AgentSelectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#1E90FF", "#00d4aa"]}
        style={styles.topBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:
              Platform.OS === "web" ? 67 + 16 : insets.top + 16,
            paddingBottom:
              Platform.OS === "web" ? 34 + 24 : insets.bottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: colors.primary }]}>
            La Vai La Vem Turismo · Natal/RN
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Família La Vai La Vem
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            Com quem você quer falar hoje?
          </Text>
        </View>

        <View style={styles.cardList}>
          {AGENTS.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          Há mais de 9 anos tornando sua viagem inesquecível
        </Text>
      </ScrollView>

      <LinearGradient
        colors={["#1E90FF", "#00d4aa"]}
        style={styles.bottomBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 3,
  },
  bottomBar: {
    height: 3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  cardList: {
    gap: 14,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    flexShrink: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 2,
  },
  roleText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  agentName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  agentTagline: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  ctaButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 24,
  },
});
