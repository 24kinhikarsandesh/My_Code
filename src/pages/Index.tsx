import { useState } from "react";
import { Header } from "@/components/Header";
import { TranscriptInput } from "@/components/TranscriptInput";
import { VoiceInput } from "@/components/VoiceInput";
import { InputModeToggle, InputMode } from "@/components/InputModeToggle";
import { RiskMeter } from "@/components/RiskMeter";
import { PhaseAnalysis } from "@/components/PhaseAnalysis";
import { Timeline } from "@/components/Timeline";
import { AnalysisSummary } from "@/components/AnalysisSummary";
import { EmptyState } from "@/components/EmptyState";
import { useTranscriptAnalysis } from "@/hooks/useTranscriptAnalysis";

const Index = () => {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const { isLoading, result, analyzeTranscript } = useTranscriptAnalysis();

  const handleVoiceTranscription = (transcript: string) => {
    // Auto-submit transcribed text for analysis
    analyzeTranscript(transcript);
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern bg-grid">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Input Mode Toggle */}
        <div className="flex justify-center mb-6">
          <InputModeToggle 
            mode={inputMode} 
            onModeChange={setInputMode}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Input */}
          <div className="lg:col-span-2 space-y-6">
            {inputMode === "text" ? (
              <TranscriptInput onAnalyze={analyzeTranscript} isLoading={isLoading} />
            ) : (
              <VoiceInput 
                onTranscriptionComplete={handleVoiceTranscription} 
                isAnalyzing={isLoading}
              />
            )}
            
            {result ? (
              <>
                <AnalysisSummary summary={result.summary} />
                <Timeline timeline={result.timeline} />
              </>
            ) : !isLoading && (
              <EmptyState />
            )}
          </div>

          {/* Right column - Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <RiskMeter 
                  score={result.riskScore} 
                  classification={result.classification} 
                />
                <PhaseAnalysis phases={result.phases} />
              </>
            ) : (
              <div className="glass-card p-6 flex flex-col items-center justify-center h-64 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full border-2 border-muted-foreground border-t-primary animate-spin" />
                </div>
                <p className="text-muted-foreground text-sm">
                  {isLoading ? "Analyzing transcript..." : "Awaiting transcript input"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            ScamShield detects psychological manipulation patterns. Always verify suspicious calls with official sources.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
