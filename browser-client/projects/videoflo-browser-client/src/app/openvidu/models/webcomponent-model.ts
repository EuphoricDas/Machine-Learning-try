import { ISessionInfo } from '../types/webcomponent-config';
import { ExternalConfigModel } from './external-config';

export class WebComponentModel extends ExternalConfigModel {
	private sessionInfo: ISessionInfo;

	constructor() {
		super();
	}

	setSessionInfo(config: ISessionInfo) {
		this.sessionInfo = config;

		if (!!this.sessionInfo) {
			this.sessionName = this.sessionInfo.sessionName;
			this.nickname = this.sessionInfo.participantName;
			this.tokens = this.sessionInfo.tokens;
			if (this.sessionInfo.ovSettings && this.isOvSettingsType(this.sessionInfo.ovSettings)) {
				this.ovSettings.set(this.sessionInfo.ovSettings);
			}
			// Allow screen sharing only if two tokens are received
			this.ovSettings.setScreenSharing(this.ovSettings.hasScreenSharing() && this.tokens?.length > 1);
			// if (!this.ovSettings.hasScreenSharing()) {
			// 	console.warn('ScreenSharing has been disabled. OpenVidu Angular has received only one token.');
			// }
		}
	}

	private isOvSettingsType(obj) {
		return (
			'chat' in obj &&
			typeof obj['chat'] === 'boolean' &&
			'autopublish' in obj &&
			typeof obj['autopublish'] === 'boolean' &&
			'toolbar' in obj &&
			typeof obj['toolbar'] === 'boolean' &&
			'footer' in obj &&
			typeof obj['footer'] === 'boolean' &&
			'toolbarButtons' in obj &&
			typeof obj['toolbarButtons'] === 'object' &&
			'audio' in obj.toolbarButtons &&
			typeof obj.toolbarButtons['audio'] === 'boolean' &&
			'audio' in obj.toolbarButtons &&
			typeof obj.toolbarButtons['audio'] === 'boolean' &&
			'video' in obj.toolbarButtons &&
			typeof obj.toolbarButtons['video'] === 'boolean' &&
			'screenShare' in obj.toolbarButtons &&
			typeof obj.toolbarButtons['screenShare'] === 'boolean' &&
			'fullscreen' in obj.toolbarButtons &&
			typeof obj.toolbarButtons['fullscreen'] === 'boolean' &&
			'layoutSpeaking' in obj.toolbarButtons &&
			typeof obj.toolbarButtons['layoutSpeaking'] === 'boolean' &&
			'exit' in obj.toolbarButtons &&
			typeof obj.toolbarButtons['exit'] === 'boolean'
		);
	}
}
