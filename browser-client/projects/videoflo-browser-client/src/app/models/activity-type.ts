export abstract class ActivityType {
  static readonly Welcome: string = 'Welcome';
  static readonly GeolocationVerification: string = 'GeolocationVerification';
  static readonly IpAddressVerification: string = 'IpAddressVerification';
  static readonly QnA: string = 'QnA';
  static readonly MatchHeadPoses: string = 'MatchHeadPoses';
  static readonly FaceRecognition: string = 'FaceRecognition';
  static readonly PanRecognition: string = 'PanRecognition';
  static readonly CaptureImage: string = 'CaptureImage';
  static readonly ManualPrompt: string = 'ManualPrompt';
  static readonly Finish: string = 'Finish';
}
