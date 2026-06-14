import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage, parseResponse } from "../lib/api";
import type { ChatMessage } from "../lib/api";
import { MessageBubble } from "../components/MessageBubble";
import type { Message } from "../components/MessageBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { QuickReplies } from "../components/QuickReplies";
import mascoteImg from "@assets/ChatGPT_Image_21_de_dez._de_2025,_13_03_23_1781388637862.png";

let idCounter = 0;
function uid() {
  return String(Date.now()) + String(++idCounter);
}

const WELCOME_CHIPS = ["🏄 Aventura", "🌊 Praia", "🏛️ História", "💰 Preços"];

const WELCOME_MESSAGE: Message = {
  id: "welcome-0",
  role: "bot",
  text: "Olá! Sou a Lala, sua guia virtual da La Vai La Vem Turismo! 🌊 Estou aqui para te ajudar a escolher os melhores passeios em Natal/RN. Você prefere aventura nas dunas, mergulho no mar, ou conhecer a cidade histórica?",
  chips: WELCOME_CHIPS,
};

const LS_MESSAGES_KEY = "lala_chat_messages";
const LS_HISTORY_KEY = "lala_chat_history";
const LS_CHIPS_SEEN_KEY = "lala_welcome_chips_seen";

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

function getInitialMessages(): Message[] {
  const saved = loadFromStorage<Message[]>(LS_MESSAGES_KEY);
  if (saved && saved.length > 0) return saved;
  return [WELCOME_MESSAGE];
}

function getInitialHistory(): ChatMessage[] {
  const saved = loadFromStorage<ChatMessage[]>(LS_HISTORY_KEY);
  return saved ?? [];
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>(getInitialHistory);
  // True only on the very first ever opening of the app (no LS flag present).
  // Once set false (by "Nova conversa" or next sessions) chips never return.
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

  // Persist the "chips seen" flag on first mount so future sessions skip chips.
  useEffect(() => {
    localStorage.setItem(LS_CHIPS_SEEN_KEY, "true");
  }, []);

  const handleNewConversation = useCallback(() => {
    localStorage.removeItem(LS_MESSAGES_KEY);
    localStorage.removeItem(LS_HISTORY_KEY);
    setMessages([WELCOME_MESSAGE]);
    setHistory([]);
    setInput("");
    setShowWelcomeChips(false); // chips never reappear after Nova conversa
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
      const rawContent = await sendChatMessage(newHistory);
      const parsed = parseResponse(rawContent);

      const botMessage: Message = {
        id: uid(),
        role: "bot",
        text: parsed.text,
        resumo: parsed.resumo,
        suporte: parsed.suporte,
      };

      setMessages((prev) => [...prev, botMessage]);
      setHistory((prev) => [...prev, { role: "assistant", content: rawContent }]);
    } catch (err) {
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
  }, [input, isTyping, history]);

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
          borderBottom: "1px solid rgba(30,144,255,0.2)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border-2"
          style={{ borderColor: "var(--color-brand-blue)" }}
        >
          <img
            src={mascoteImg}
            alt="Lala mascote"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-base font-semibold text-white leading-tight">Lala</span>
          <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-brand-teal)" }}>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-brand-teal)" }}
            />
            La Vai La Vem Turismo · Online agora
          </span>
        </div>

        {/* Nova conversa button — only when there's a saved conversation */}
        {messages.length > 1 && (
          <button
            onClick={handleNewConversation}
            title="Nova conversa"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(30,144,255,0.12)",
              border: "1px solid rgba(30,144,255,0.3)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.35" />
            </svg>
            Nova conversa
          </button>
        )}
      </header>

      {/* Wave stripe */}
      <div className="wave-divider flex-shrink-0" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={msg.id} className="flex flex-col gap-2">
            <MessageBubble message={msg} />
            {msg.chips && i === lastBotIndex && !isTyping && showWelcomeChips && (
              <QuickReplies
                chips={msg.chips}
                onSelect={handleChipClick}
                disabled={isTyping}
              />
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: "var(--color-bg-card)",
          borderTop: "1px solid rgba(30,144,255,0.2)",
        }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(30,144,255,0.2)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
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
              background: input.trim() && !isTyping
                ? "linear-gradient(135deg, var(--color-brand-blue), #0a7acc)"
                : "rgba(255,255,255,0.08)",
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
