import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage, parseResponse } from "../lib/api";
import type { ChatMessage } from "../lib/api";
import { MessageBubble } from "../components/MessageBubble";
import type { Message } from "../components/MessageBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { QuickReplies } from "../components/QuickReplies";
import type { AgentDef } from "../lib/agents";

let idCounter = 0;
function uid() {
  return String(Date.now()) + String(++idCounter);
}

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently
  }
}

interface Props {
  agent: AgentDef;
  onBack: () => void;
}

export function ChatPage({ agent, onBack }: Props) {
  const LS_MESSAGES_KEY = `${agent.lsPrefix}_chat_messages`;
  const LS_HISTORY_KEY = `${agent.lsPrefix}_chat_history`;
  const LS_CHIPS_SEEN_KEY = `${agent.lsPrefix}_chips_seen`;

  const welcomeMessage: Message = {
    id: `welcome-${agent.id}`,
    role: "bot",
    text: agent.welcomeText,
    chips: agent.welcomeChips,
  };

  const getInitialMessages = () => {
    const saved = loadFromStorage<Message[]>(LS_MESSAGES_KEY);
    if (saved && saved.length > 0) return saved;
    return [welcomeMessage];
  };

  const getInitialHistory = () => {
    const saved = loadFromStorage<ChatMessage[]>(LS_HISTORY_KEY);
    return saved ?? [];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>(getInitialHistory);
  const [showWelcomeChips, setShowWelcomeChips] = useState<boolean>(
    () => localStorage.getItem(LS_CHIPS_SEEN_KEY) !== "true"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    saveToStorage(LS_MESSAGES_KEY, messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage(LS_HISTORY_KEY, history);
  }, [history]);

  useEffect(() => {
    localStorage.setItem(LS_CHIPS_SEEN_KEY, "true");
  }, []);

  const handleNewConversation = useCallback(() => {
    localStorage.removeItem(LS_MESSAGES_KEY);
    localStorage.removeItem(LS_HISTORY_KEY);
    setMessages([welcomeMessage]);
    setHistory([]);
    setInput("");
    setShowWelcomeChips(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleSend = useCallback(async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || isTyping) return;

    if (!override) setInput("");

    const userMessage: Message = { id: uid(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    const newHistory: ChatMessage[] = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setIsTyping(true);

    try {
      const rawContent = await sendChatMessage(newHistory, agent.id);
      const parsed = parseResponse(rawContent);

      const botMessage: Message = {
        id: uid(),
        role: "bot",
        text: parsed.text,
        resumo: parsed.resumo,
        suporte: parsed.suporte,
        chips: parsed.chips,
      };

      setMessages((prev) => [...prev, botMessage]);
      setHistory((prev) => [...prev, { role: "assistant", content: rawContent }]);
    } catch {
      const errMessage: Message = {
        id: uid(),
        role: "bot",
        text: "Ops! Tive um probleminha técnico. Por favor, tente novamente em alguns instantes. 😅",
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, isTyping, history, agent.id]);

  const handleChipClick = useCallback((chip: string) => {
    handleSend(chip);
  }, [handleSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const lastBotIndex = messages.reduceRight(
    (found, msg, i) => (found === -1 && msg.role === "bot" ? i : found),
    -1
  );

  return (
    <div
      className="flex flex-col h-screen w-full"
      style={{ background: "var(--color-bg-deep)", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center gap-3 px-4 py-3 z-10"
        style={{
          background: "var(--color-bg-card)",
          borderBottom: `1px solid rgba(${agent.colorRgb}, 0.25)`,
          boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: `rgba(${agent.colorRgb}, 0.12)`, color: agent.color }}
          aria-label="Voltar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border-2"
          style={{ borderColor: agent.color }}
        >
          <img
            src={agent.img}
            alt={agent.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Name + status */}
        <div className="flex flex-col flex-1">
          <span className="text-base font-semibold text-white leading-tight">{agent.name}</span>
          <span className="text-xs flex items-center gap-1" style={{ color: agent.color }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: agent.color }} />
            {agent.role} · Online agora
          </span>
        </div>

        {/* Nova conversa */}
        {messages.length > 1 && (
          <button
            onClick={handleNewConversation}
            title="Nova conversa"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: `rgba(${agent.colorRgb}, 0.12)`,
              border: `1px solid rgba(${agent.colorRgb}, 0.3)`,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.35" />
            </svg>
            Nova
          </button>
        )}
      </header>

      {/* Wave stripe in agent color */}
      <div
        className="flex-shrink-0 h-[3px]"
        style={{ background: agent.gradient }}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={msg.id} className="flex flex-col gap-2">
            <MessageBubble message={msg} agent={agent} />
            {msg.chips && i === lastBotIndex && !isTyping &&
              (msg.id !== `welcome-${agent.id}` || showWelcomeChips) && (
              <QuickReplies
                chips={msg.chips}
                onSelect={handleChipClick}
                disabled={isTyping}
                color={agent.color}
                colorRgb={agent.colorRgb}
              />
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator color={agent.color} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: "var(--color-bg-card)",
          borderTop: `1px solid rgba(${agent.colorRgb}, 0.2)`,
        }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid rgba(${agent.colorRgb}, 0.2)`,
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Fale com ${agent.name}...`}
            rows={1}
            className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-white/30 py-2 max-h-32"
            style={{ lineHeight: "1.5" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 128) + "px";
            }}
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all mb-1"
            style={{
              background: input.trim() && !isTyping ? agent.gradient : "rgba(255,255,255,0.08)",
              color: input.trim() && !isTyping ? "#fff" : "rgba(255,255,255,0.3)",
              transform: input.trim() && !isTyping ? "scale(1)" : "scale(0.95)",
            }}
            aria-label="Enviar mensagem"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          La Vai La Vem Turismo · Natal/RN · Há mais de 9 anos tornando sua viagem inesquecível
        </p>
      </div>
    </div>
  );
}
