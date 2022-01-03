import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevicePermissionsChecklist } from '../../../api/models/device-permissions-checklist';
import { DevicePermissionsResponse, PermissionItem } from './device-permissions-response';

@Component({
  selector: 'videoflo-device-permissions',
  templateUrl: './device-permissions.component.html',
  styleUrls: ['./device-permissions.component.css']
})
export class DevicePermissionsComponent implements OnInit {
  @Input() permissionsConfig: DevicePermissionsChecklist;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPermissionsAcquired = new EventEmitter<any>();

  _permissionsToGet: PermissionItem[];

  private currentItem: PermissionItem;

  private devicePermissionsResponse = new DevicePermissionsResponse();

  allPermissionsGiven = false;

  constructor() {}

  ngOnInit(): void {
    const items = new Array<PermissionItem>();

    if (!!this.permissionsConfig.geolocation) {
      items.push({
        icon: 'location_on',
        text: this.permissionsConfig.geolocation,
        display: false,
        isPermissionGiven: false,
        permissionFunction: this.getGeolocation
      });
    }

    if (!!this.permissionsConfig.camera) {
      items.push({
        icon: 'videocam',
        text: this.permissionsConfig.camera,
        display: false,
        isPermissionGiven: false,
        permissionFunction: this.getCameraPermission
      });
    }

    if (!!this.permissionsConfig.microphone) {
      items.push({
        icon: 'perm_camera_mic',
        text: this.permissionsConfig.microphone,
        display: false,
        isPermissionGiven: false,
        permissionFunction: this.getMicrophonePermission
      });
    }

    this._permissionsToGet = items;

    this.getPermissions();
  }

  async getPermissions(): Promise<void> {
    this.currentItem = this._permissionsToGet.find((item) => !item.display && !item.isPermissionGiven);

    if (!!this.currentItem) {
      this.currentItem.display = true;
      this.currentItem.permissionFunction.call(this);
    } else {
      this.allPermissionsGiven = true;

      setTimeout(() => {
        this.onPermissionsAcquired.emit(this.devicePermissionsResponse);
      }, 500);
    }
  }

  async getGeolocation(): Promise<void> {
    navigator.geolocation.getCurrentPosition(
      async (resp) => {
        this.devicePermissionsResponse.locationPermissionTimestamp = new Date();

        // Note: resp.coords does not get serialized to JSON directly. Seems to be some special object treated differently by the browers.
        // Therefore we construct a new object with the same values
        this.devicePermissionsResponse.geoCoordinates = {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
          accuracy: resp.coords.accuracy
        };

        this.currentItem.isPermissionGiven = true;
        this.getPermissions();
      },
      (err) => {
        this.currentItem.error = `Please click on the allow button to give location permission.`;

        setTimeout(() => this.getGeolocation(), 300);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      }
    );
  }

  async getCameraPermission(): Promise<void> {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true
      });

      this.devicePermissionsResponse.cameraPermissionTimestamp = new Date();
      this.currentItem.isPermissionGiven = true;
      this.getPermissions();
    } catch {
      this.currentItem.error = `Please click on the allow button to give camera permission.`;

      setTimeout(() => this.getCameraPermission(), 300);
    }
  }

  async getMicrophonePermission(): Promise<void> {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      this.devicePermissionsResponse.microphonePermissionTimestamp = new Date();
      this.currentItem.isPermissionGiven = true;
      this.getPermissions();
    } catch {
      this.currentItem.error = `Please click on the allow button to give microphone permission.`;

      setTimeout(() => this.getMicrophonePermission(), 300);
    }
  }
}
