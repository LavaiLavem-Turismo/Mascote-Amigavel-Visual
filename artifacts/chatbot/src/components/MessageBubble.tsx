import { FaWhatsapp } from "react-icons/fa";
import mascoteImg from "@assets/ChatGPT_Image_21_de_dez._de_2025,_13_03_23_1781388637862.png";
import type { ResumoData, SuporteData } from "../lib/api";
import { WhatsAppButton } from "./WhatsAppButton";
import { CATALOG } from "../catalog";

export interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  resumo?: ResumoData;
  suporte?: SuporteData;
  chips?: string[];
}

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isBot = message.role === "bot";

  return (
    <div className={`flex items-end gap-2 msg-animate ${isBot ? "" : "flex-row-reverse"}`}>
      {isBot && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2"
          style={{ borderColor: "var(--color-brand-blue)" }}
        >
          <img src={mascoteImg} alt="Lala" className="w-full h-full object-cover object-top" />
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[78%] ${isBot ? "" : "items-end"}`}>
        {message.text && (
          <div
            className={`px-4 py-3 text-sm leading-relaxed ${
              isBot
                ? "rounded-2xl rounded-bl-sm text-white/90"
                : "rounded-2xl rounded-br-sm text-white font-medium"
            }`}
            style={
              isBot
                ? {
                    background: "var(--color-bg-card)",
                    border: "1px solid rgba(30,144,255,0.15)",
                  }
                : {
                    background: "linear-gradient(135deg, var(--color-brand-blue), #0a7acc)",
                    boxShadow: "0 4px 14px rgba(30,144,255,0.25)",
                  }
            }
          >
            {message.text.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < message.text.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
        )}

        {message.resumo && (
          <WhatsAppButton resumo={message.resumo} whatsapp={CATALOG.whatsapp} />
        )}

        {message.suporte && (
          <div
            className="msg-animate rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: "var(--color-bg-card)", border: "1px solid rgba(192,57,43,0.4)" }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold" style={{ color: "#e74c3c" }}>
                ⚠️ Atendente humano necessário
              </p>
              <p className="text-xs text-white/60">
                Assunto: <em>{message.suporte.problema}</em>
              </p>
              {message.suporte.nome && (
                <p className="text-xs text-white/60">Cliente: {message.suporte.nome}</p>
              )}
            </div>
            <a
              href={`https://wa.me/${CATALOG.whatsapp}?text=${encodeURIComponent(
                `Olá! Preciso de suporte.\n\n` +
                `👤 Nome: ${message.suporte.nome || "não informado"}\n` +
                `❓ Problema: ${message.suporte.problema}\n\n` +
                `Fui direcionado pelo chatbot da La Vai La Vem Turismo.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: "#25D366", boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }}
            >
              <FaWhatsapp size={20} />
              Falar com atendente
            </a>
          </div>
        )}
      </div>

      {!isBot && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--color-brand-blue)", color: "#fff" }}
        >
          {/* user avatar */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      )}
    </div>
  );
}
