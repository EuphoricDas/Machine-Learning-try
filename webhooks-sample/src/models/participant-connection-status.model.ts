export interface ParticipantConnectionStatusModel {
  sessionId: string;
  participantId: string;
  externalParticipantId: string;
  role: string;
  connectionState: 'connected' | 'disconnected';
}
