export class PermissionItem {
  icon?: string;
  text: string;
  error?: string;
  display = false;
  isPermissionGiven = false;
  permissionFunction: () => Promise<void>;
}

export class DevicePermissionsResponse {
  cameraPermissionTimestamp?: Date;

  microphonePermissionTimestamp?: Date;

  locationPermissionTimestamp?: Date;

  geoCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}
