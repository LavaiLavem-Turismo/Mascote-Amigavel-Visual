interface Props {
  color?: string;
}

export function TypingIndicator({ color = "var(--color-brand-teal)" }: Props) {
  return (
    <div className="flex items-end gap-2 msg-animate">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center text-lg"
        style={{ borderColor: color, background: "var(--color-bg-card)" }}
      >
        🦜
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
        style={{ background: "var(--color-bg-card)", border: `1px solid rgba(0,0,0,0.15)` }}
      >
        <span className="typing-dot w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="typing-dot w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="typing-dot w-2 h-2 rounded-full" style={{ background: color }} />
      </div>
    </div>
  );
}
