import { AGENTS } from "../lib/agents";
import type { AgentDef } from "../lib/agents";

const floatClasses = ["float-anim", "float-anim-delay", "float-anim-delay2"];
const cardClasses = ["card-animate", "card-animate-d1", "card-animate-d2"];

interface Props {
  onSelect: (agent: AgentDef) => void;
}

export function AgentSelectPage({ onSelect }: Props) {
  return (
    <div
      className="flex flex-col min-h-screen w-full"
      style={{ background: "var(--color-bg-deep)", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header strip */}
      <div className="wave-divider flex-shrink-0" />

      {/* Hero */}
      <div className="flex flex-col items-center pt-10 pb-4 px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-brand-teal)" }}>
          La Vai La Vem Turismo · Natal/RN
        </p>
        <h1 className="text-3xl font-bold text-white leading-tight">
          Família La Vai La Vem 🦜
        </h1>
        <p className="mt-2 text-white/50 text-sm max-w-xs">
          Com quem você quer falar hoje?
        </p>
      </div>

      {/* Character cards */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch justify-center gap-4 px-4 py-6 max-w-2xl mx-auto w-full">
        {AGENTS.map((agent, idx) => (
          <button
            key={agent.id}
            onClick={() => onSelect(agent)}
            className={`agent-card ${cardClasses[idx]} flex flex-col items-center rounded-3xl p-5 flex-1 text-left`}
            style={{
              background: "var(--color-bg-card)",
              border: `2px solid rgba(${agent.colorRgb}, 0.35)`,
              boxShadow: `0 4px 24px rgba(${agent.colorRgb}, 0.15)`,
            }}
          >
            {/* Character image */}
            <div
              className={`${floatClasses[idx]} w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 mb-4 flex-shrink-0`}
              style={{
                borderColor: `rgba(${agent.colorRgb}, 0.6)`,
                boxShadow: `0 8px 28px rgba(${agent.colorRgb}, 0.3)`,
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={agent.img}
                alt={agent.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Role badge */}
            <span
              className="text-xs font-bold px-3 py-1 rounded-full mb-2"
              style={{
                background: `rgba(${agent.colorRgb}, 0.18)`,
                color: agent.color,
                border: `1px solid rgba(${agent.colorRgb}, 0.4)`,
              }}
            >
              {agent.role}
            </span>

            {/* Name */}
            <h2 className="text-lg font-bold text-white text-center leading-tight">{agent.name}</h2>

            {/* Tagline */}
            <p className="mt-1 text-xs text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
              {agent.tagline}
            </p>

            {/* CTA */}
            <div
              className="mt-4 w-full py-2.5 rounded-2xl text-sm font-semibold text-white text-center"
              style={{ background: agent.gradient }}
            >
              Conversar
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-xs pb-6" style={{ color: "rgba(255,255,255,0.18)" }}>
        Há mais de 9 anos tornando sua viagem inesquecível
      </p>

      <div className="wave-divider flex-shrink-0" />
    </div>
  );
}
