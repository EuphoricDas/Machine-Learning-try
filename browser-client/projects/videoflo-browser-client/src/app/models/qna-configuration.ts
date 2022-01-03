export interface QnAConfiguration {
  title: string;
  description: string;
  noOfQuestionsToAsk: number;
  qnaPairs: QnaItem[];
}

export interface QnaItem {
  question: string;
  expectedAnswer: string;
  actualAnswer?: string;
  allowedAttempts?: number;
  attemptsMade?: number;
  isAnswered?: boolean;
  isAnswerCorrect?: boolean;
  speech?: TextToSpeechOptions;
}

export interface TextToSpeechOptions {
  speak?: string;
  audioUrl?: string;
}

export interface QnAResponse {
  question: string;
  expectedAnswer: string;
  actualAnswer: string;
  isAnswered: boolean;
  isAnswerCorrect: boolean;
  attemptsMade: number;
}
