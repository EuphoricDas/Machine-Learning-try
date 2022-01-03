const fs = require('fs-extra');

const dirsToCopy = [
  ['./projects/videoflo-browser-client/src/app/videoflo-component', './projects/videoflo-angular/src/lib/videoflo-component'],
  ['./projects/videoflo-browser-client/src/app/video-room', './projects/videoflo-angular/src/lib/video-room'],
  ['./projects/videoflo-browser-client/src/app/openvidu', './projects/videoflo-angular/src/lib/openvidu'],
  ['./projects/videoflo-browser-client/src/app/activities', './projects/videoflo-angular/src/lib/activities'],
  ['./projects/videoflo-browser-client/src/app/api', './projects/videoflo-angular/src/lib/api'],
  ['./projects/videoflo-browser-client/src/app/models', './projects/videoflo-angular/src/lib/models'],
  ['./projects/videoflo-browser-client/src/app/services', './projects/videoflo-angular/src/lib/services'],
  ['./projects/videoflo-browser-client/src/app/shared', './projects/videoflo-angular/src/lib/shared'],
  ['./projects/videoflo-browser-client/src/app/environments', './projects/videoflo-angular/src/lib/environments'],
  ['./projects/videoflo-browser-client/src/assets', './projects/videoflo-angular/assets'],
];

try {
  for (let i = 0; i < dirsToCopy.length; i++) {
    const [sourceDir, destDir] = dirsToCopy[i];
    if (fs.existsSync(destDir)) {
      fs.removeSync(destDir);
    }
  }
} catch (err) {
  console.error('Error executing clean library function in pkg-angular-lib-build.js', err);
}

try {
  for (let i = 0; i < dirsToCopy.length; i++) {
    const [sourceDir, destDir] = dirsToCopy[i];

    fs.copySync(sourceDir, destDir, { overwrite: true, recursive: true });
  }
} catch (err) {
  console.error('Error executing copy function in pkg-angular-lib-build.js', err);
}
