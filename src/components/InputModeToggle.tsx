import { FileText, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export type InputMode = "text" | "voice";

interface InputModeToggleProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  disabled?: boolean;
}

export const InputModeToggle = ({ mode, onModeChange, disabled }: InputModeToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-secondary/50 rounded-lg border border-border/50">
      <button
        onClick={() => onModeChange("text")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          mode === "text"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <FileText className="w-4 h-4" />
        Text Mode
      </button>
      <button
        onClick={() => onModeChange("voice")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          mode === "voice"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Mic className="w-4 h-4" />
        Voice Mode
      </button>
    </div>
  );
};
