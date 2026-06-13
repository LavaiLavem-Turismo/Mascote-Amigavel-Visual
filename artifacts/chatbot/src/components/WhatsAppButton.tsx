import { FaWhatsapp } from "react-icons/fa";
import type { ResumoData } from "../lib/api";

interface Props {
  resumo: ResumoData;
  whatsapp: string;
}

export function WhatsAppButton({ resumo, whatsapp }: Props) {
  const passeiosStr = resumo.passeios.join(", ");
  const texto = encodeURIComponent(
    `Olá! Gostaria de reservar os seguintes passeios:\n\n` +
    `👤 Nome: ${resumo.nome}\n` +
    `🌊 Passeios: ${passeiosStr}\n` +
    `📅 Data: ${resumo.data}\n` +
    `👥 Pessoas: ${resumo.pessoas}\n\n` +
    `Vi as informações no chatbot da La Vai La Vem Turismo!`
  );

  return (
    <div
      className="msg-animate rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: "var(--color-bg-card)", border: "1px solid rgba(0,212,170,0.3)" }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold" style={{ color: "var(--color-brand-teal)" }}>
          Resumo da sua reserva:
        </p>
        <p className="text-sm text-white/80">👤 {resumo.nome}</p>
        <p className="text-sm text-white/80">🌊 {passeiosStr}</p>
        <p className="text-sm text-white/80">📅 {resumo.data}</p>
        <p className="text-sm text-white/80">👥 {resumo.pessoas} pessoa(s)</p>
      </div>
      <a
        href={`https://wa.me/${whatsapp}?text=${texto}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
        style={{ background: "#25D366", boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }}
      >
        <FaWhatsapp size={20} />
        Falar pelo WhatsApp
      </a>
    </div>
  );
}
