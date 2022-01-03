import { StreamManager, Publisher } from 'openvidu-browser';
import { VideoType } from '../types/video-type';

/**
 * Packs all the information about the user
 */
export class UserModel {
  /**
   * The Connection ID that is publishing the stream
   */
  connectionId: string;

  /**
   * The user nickname
   */
  nickname: string;

  /**
   * StreamManager object ([[Publisher]] or [[Subscriber]])
   */
  streamManager: StreamManager;

  /**
   * Server data
   */
  data: any;

  /**
   * @hidden
   */
  avatar: string;

  /**
   * @hidden
   */
  local: boolean;

  /**
   * @hidden
   */
  // private randomAvatar: string;

  /**
   * @hidden
   */
  videoSizeBig: boolean;

  /**
   * @hidden
   */
  constructor(connectionId: string, streamManager: StreamManager, nickname: string, data: any) {
    this.connectionId = connectionId || '';
    this.nickname = nickname || 'OpenVidu';
    this.streamManager = streamManager || null;
    this.data = data;
  }

  /**
   * Return `true` if audio track is active and `false` if audio track is muted
   */
  public isAudioActive(): boolean {
    // console.log("isAudioActive");
    return (this.streamManager as Publisher)?.stream?.audioActive;
  }

  /**
   * Return `true` if video track is active and `false` if video track is muted
   */
  public isVideoActive(): boolean {
    // console.log("isVideoActive");
    return (this.streamManager as Publisher)?.stream?.videoActive;
  }

  /**
   * Return the connection ID
   */
  public getConnectionId(): string {
    return this.streamManager?.stream?.connection?.connectionId || this.connectionId;
  }

  /**
   * Return the user nickname
   */
  public getNickname(): string {
    return this.nickname;
  }

  /**
   * Return the [[streamManger]] object
   */
  public getStreamManager(): StreamManager {
    return this.streamManager;
  }

  /**
   * Return the user avatar
   */
  public getAvatar(): string {
    return this.avatar;
  }

  public setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  /**
   * Return `true` if user has a local role and `false` if not
   */
  public isLocal(): boolean {
    return this.local;
  }

  /**
   * Return `true` if user has a remote role and `false` if not
   */
  public isRemote(): boolean {
    return (this.streamManager as Publisher)?.remote;
  }

  /**
   * Return `true` if user has a screen role and `false` if not
   */
  public isScreen(): boolean {
    // console.log("isScreen");
    return (this.streamManager as Publisher)?.stream?.typeOfVideo === VideoType.SCREEN;
  }

  /**
   * Return `true` if user has a camera role and `false` if not
   */
  public isCamera(): boolean {
    // console.log("CCC");
    return (this.streamManager as Publisher)?.stream?.typeOfVideo === VideoType.CAMERA || (this.isLocal() && !this.isScreen());
  }

  /**
   * Set the streamManager value object
   * @param streamManager value of streamManager
   */
  public setStreamManager(streamManager: StreamManager) {
    this.streamManager = streamManager;
  }

  /**
   * Set the user nickname value
   * @param nickname value of user nickname
   */
  public setNickname(nickname: string) {
    this.nickname = nickname;
  }

  public isVideoSizeBig(): boolean {
    return this.videoSizeBig;
  }

  /**
   * @hidden
   */
  public setVideoSizeBig(big: boolean) {
    this.videoSizeBig = big;
  }

  /**
   * @hidden
   */
  // Used when the streamManager is null (users without devices)
  public setLocal(local: boolean) {
    this.local = local;
  }
}
