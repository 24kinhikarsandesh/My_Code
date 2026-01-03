import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseVoiceRecorderProps {
  onTranscriptionComplete: (transcript: string) => void;
}

export const useVoiceRecorder = ({ onTranscriptionComplete }: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔒 prevents infinite callback loop
  const hasSentTranscriptRef = useRef(false);

  const { toast } = useToast();

  /* =========================
     START RECORDING
     ========================= */
  const startRecording = useCallback(async () => {
    try {
      // reset guards
      hasSentTranscriptRef.current = false;
      chunksRef.current = [];
      setRecordingDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // stop tracks immediately
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        // cleanup recorder
        mediaRecorderRef.current = null;

        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error("Recording error:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access",
        variant: "destructive",
      });
    }
  }, [toast]);

  /* =========================
     STOP RECORDING
     ========================= */
  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state === "inactive") return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* =========================
     TRANSCRIPTION
     ========================= */
  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const audioFile = new File([audioBlob], "recording.webm", {
        type: audioBlob.type,
      });

      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Transcription failed");
      }

      const data = await response.json();

      // 🔒 GUARDED CALLBACK (THIS FIXES THE BUG)
      if (data.transcript && !hasSentTranscriptRef.current) {
        hasSentTranscriptRef.current = true;

        onTranscriptionComplete(data.transcript);

        toast({
          title: "Transcription complete",
          description: "Your recording has been transcribed",
        });
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
      setRecordingDuration(0);
    }
  };

  /* =========================
     UTILS
     ========================= */
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    isRecording,
    isTranscribing,
    recordingDuration,
    formattedDuration: formatDuration(recordingDuration),
    startRecording,
    stopRecording,
  };
};
