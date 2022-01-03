import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private speech: SpeechRecognition;
  private synthesis: SpeechSynthesis;
  constructor() {
    const SpeechRecognition = window['speechRecognition'] || window['SpeechRecognition'] || window['webkitSpeechRecognition'];

    this.speech = SpeechRecognition ? new SpeechRecognition() : null;
    this.synthesis = speechSynthesis;
  }

  startRecoding(): void {
    this.speech.start();
  }

  pauseRecording(): void {
    this.speech.stop();
  }

  abortRecording(): void {
    this.speech.abort();
  }

  speak(value: string) {
    const utterance = new SpeechSynthesisUtterance(value);
    this.synthesis.speak(utterance);
  }

  getSpeechData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.speech.addEventListener('end', () => {
        this.speech.stop();
      });
      this.speech.addEventListener('result', (event) => {
        const result = event.results[0][0].transcript;
        resolve(result);
      });
      this.speech.addEventListener('error', (err) => {
        this.speech.stop();
        reject(err.message);
      });
    });
  }
}
