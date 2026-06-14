interface Props {
  chips: string[];
  onSelect: (chip: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ chips, onSelect, disabled }: Props) {
  return (
    <div className="flex gap-2 flex-wrap mt-1 ml-10">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => !disabled && onSelect(chip)}
          disabled={disabled}
          className="chip-btn text-sm px-3 py-1.5 rounded-full border transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderColor: "rgba(30,144,255,0.35)",
            color: "rgba(255,255,255,0.85)",
            background: "rgba(30,144,255,0.08)",
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
