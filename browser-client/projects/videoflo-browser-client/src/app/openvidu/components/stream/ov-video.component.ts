import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { StreamManager } from 'openvidu-browser';
import { poster_img } from '../../../shared/images';
import { VideoType } from '../../types/video-type';

@Component({
  selector: 'videoflo-video',
  template: `
    <img
      *ngIf="!_streamManager?.stream?.videoActive"
      class="poster_img"
      alt="User Logo"
      src="{{ poster_img }}"
    />
    <video
      autoplay
      playsinline
      #videoElement
      [attr.id]="'video-' + (_streamManager?.stream?.streamId || 'undefined')"
      [muted]="mutedSound"
    ></video>
  `,
  styleUrls: ['./stream.component.css'],
})
export class OpenViduVideoComponent implements AfterViewInit {
  @Input() mutedSound: boolean;

  @Output() toggleVideoSizeEvent = new EventEmitter<any>();

  _streamManager: StreamManager;

  _videoElement: ElementRef;

  poster_img = poster_img;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this._streamManager && this._videoElement) {
        this._streamManager.addVideoElement(this._videoElement.nativeElement);
      }
    });
  }

  @ViewChild('videoElement')
  set videoElement(element: ElementRef) {
    this._videoElement = element;
  }

  @Input()
  set streamManager(streamManager: StreamManager) {
    setTimeout(() => {
      this._streamManager = streamManager;
      if (!!this._videoElement && this._streamManager) {
        if (this._streamManager.stream.typeOfVideo === VideoType.SCREEN) {
          this._videoElement.nativeElement.style.objectFit = 'contain';
          this._videoElement.nativeElement.style.background = '#272727';
          this.enableVideoSizeBig();
        } else {
          this._videoElement.nativeElement.style.objectFit = 'cover';
        }
        this._streamManager.addVideoElement(this._videoElement.nativeElement);
      }
    });
  }

  enableVideoSizeBig() {
    // Doing video size bigger.
    // Timeout because of connectionId is null and icon does not change
    setTimeout(() => {
      this.toggleVideoSizeEvent.emit(true);
    }, 590);
  }
}
