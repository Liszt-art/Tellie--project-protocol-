/**
 * Native Browser Speech Synthesis and Speech Recognition utility
 * 100% Client-side, no external APIs or keys needed.
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private listeners: Set<(speaking: boolean, textId?: string) => void> = new Set();
  private activeTextId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (speaking: boolean, textId?: string) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.listeners.forEach(l => l(speaking, this.activeTextId || undefined));
  }

  public speak(text: string, id: string = 'general') {
    if (!this.synth) return false;

    // If currently speaking this exact item, toggle stop
    if (this.isSpeakingState && this.activeTextId === id) {
      this.stop();
      return false;
    }

    this.stop();

    this.activeTextId = id;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a soothing Vietnamese voice if available, or gentle fallback
    const voices = this.synth.getVoices();
    const viVoice = voices.find(v => v.lang.startsWith('vi') || v.lang.includes('VIE'));
    if (viVoice) {
      utterance.voice = viVoice;
    }
    
    utterance.lang = viVoice ? viVoice.lang : 'vi-VN';
    utterance.pitch = 1.05;
    utterance.rate = 0.92; // slightly slower, calming pace

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.activeTextId = null;
      this.notify(false);
    };

    utterance.onerror = () => {
      this.activeTextId = null;
      this.notify(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.activeTextId = null;
      this.notify(false);
    }
  }

  public isSpeaking(id?: string) {
    if (id) {
      return this.isSpeakingState && this.activeTextId === id;
    }
    return this.isSpeakingState;
  }
}

export const speechService = new SpeechService();

// Speech Recognition helper for dictation in Viết Tâm Sự
export const createSpeechRecognizer = (
  onResult: (text: string) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
) => {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'vi-VN';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      if (onError) onError(event.error || 'Lỗi nhận diện giọng nói');
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    return recognition;
  } catch (err) {
    return null;
  }
};
