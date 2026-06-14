interface Props {
  chips: string[];
  onSelect: (chip: string) => void;
  disabled?: boolean;
  color?: string;
  colorRgb?: string;
}

export function QuickReplies({
  chips,
  onSelect,
  disabled,
  color = "var(--color-brand-blue)",
  colorRgb = "30,144,255",
}: Props) {
  return (
    <div className="flex gap-2 flex-wrap mt-1 ml-10">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => !disabled && onSelect(chip)}
          disabled={disabled}
          className="chip-btn msg-animate text-sm px-3 py-1.5 rounded-full border transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderColor: `rgba(${colorRgb}, 0.4)`,
            color: "rgba(255,255,255,0.85)",
            background: `rgba(${colorRgb}, 0.1)`,
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
