import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscriptionComplete: (transcript: string) => void;
  isAnalyzing: boolean;
}

export const VoiceInput = ({ onTranscriptionComplete, isAnalyzing }: VoiceInputProps) => {
  const {
    isRecording,
    isTranscribing,
    formattedDuration,
    startRecording,
    stopRecording,
  } = useVoiceRecorder({ onTranscriptionComplete });

  const isProcessing = isTranscribing || isAnalyzing;

  return (
    <div className="glass-card p-8 space-y-6">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Recording visualization */}
        <div className="relative">
          <div 
            className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
              isRecording 
                ? "bg-destructive/20 border-2 border-destructive animate-pulse" 
                : isProcessing
                  ? "bg-primary/20 border-2 border-primary"
                  : "bg-secondary border-2 border-border hover:border-primary/50"
            )}
          >
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-destructive animate-ping opacity-50" />
                <div className="absolute inset-[-8px] rounded-full border border-destructive/30 animate-pulse" />
              </>
            )}
            
            {isProcessing ? (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            ) : isRecording ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-1 h-4 bg-destructive rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-6 bg-destructive rounded animate-pulse" style={{ animationDelay: '100ms' }} />
                  <div className="w-1 h-8 bg-destructive rounded animate-pulse" style={{ animationDelay: '200ms' }} />
                  <div className="w-1 h-5 bg-destructive rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                  <div className="w-1 h-7 bg-destructive rounded animate-pulse" style={{ animationDelay: '400ms' }} />
                </div>
                <span className="text-sm font-mono text-destructive">{formattedDuration}</span>
              </div>
            ) : (
              <Mic className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {isProcessing 
              ? isTranscribing 
                ? "Transcribing..." 
                : "Analyzing..."
              : isRecording 
                ? "Recording..." 
                : "Voice Input"
            }
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {isProcessing
              ? "Please wait while we process your recording"
              : isRecording
                ? "Click stop when finished speaking"
                : "Click the button below to start recording"
            }
          </p>
        </div>

        {/* Control button */}
        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={cn(
            "px-8 py-6 text-lg font-semibold transition-all",
            isRecording 
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
          )}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5 mr-2 fill-current" />
              Stop Recording
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground text-center max-w-md">
          <p>Record a phone call conversation or speak the transcript aloud.</p>
          <p className="mt-1">The audio will be automatically transcribed and analyzed for scam patterns.</p>
        </div>
      </div>
    </div>
  );
};
