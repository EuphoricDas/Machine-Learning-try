const fs = require('fs');
const semver = require('semver');
const { exit } = require('process');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptNewVersion(oldVersionNumber) {
  console.log(`Current version number is: ${oldVersionNumber}`);

  const newVersionNumber = await new Promise((resolve, reject) => {
    readline.question('Enter new version number:', newVersion => {
      if (!newVersion?.trim()?.length)
        newVersion = oldVersionNumber;

      readline.close();

      if (!semver.valid(newVersion)) {
        reject("The new version number you provided is invalid.");
      }

      if (!semver.satisfies(newVersion, `>= ${oldVersionNumber}`)) {
        reject(`The new version '${newVersion}' is not greater or equal to the current version '${oldVersionNumber}'.`);
      }

      resolve(newVersion);
    });
  });

  return newVersionNumber
}

async function updateVersion(filePath, newVersion) {
  await new Promise((resolve, reject) => {
    const packageJson = require(filePath);

    packageJson.version = newVersion;

    fs.writeFile(filePath, JSON.stringify(packageJson, null, 2), function callback(err) {
      if (err) {
        reject(`Error while writing file ${filePath}.`);
        return false;
      }

      resolve();
    });
  });
}

const packageJsonFiles = [
  './package.json',
  './projects/videoflo-angular/package.json',
  './projects/videoflo-browser-client/package.json',
  './dist/videoflo-angular/package.json',
  './dist/videoflo-webcomponent/package.json'
];

const oldVersion = require(packageJsonFiles[0]).version;

promptNewVersion(oldVersion)
  .then((newVersion) => {

    Promise.all(packageJsonFiles.map((f) => updateVersion(f, newVersion)))
      .then(() => {
        exit(0); //Success
      })
      .catch((e) => {
        console.error(e);
        exit(-2); //Error
      });
  }).catch((e) => {
    console.error(e);
    exit(-1); //Error
  });
