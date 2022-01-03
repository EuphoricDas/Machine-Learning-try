const fs = require('fs-extra');
const concat = require('concat');
let VERSION = require('./package.json').version;
let PROJECT = 'videoflo-browser-client';

module.exports.buildWebcomponent = async () => {

  const appModule = `./projects/${PROJECT}/src/app/app.module.ts`;

  try {
    console.log(`Building Videoflo Web Component (${VERSION})`);

    await buildElement();

    replaceText(appModule, "// bootstrap: [AppComponent]", "bootstrap: [AppComponent]");
    console.log(`Videoflo Web Component (${VERSION}) built`);
  } catch (error) {
    replaceText(appModule, "// bootstrap: [AppComponent]", "bootstrap: [AppComponent]");
    console.error(error);
  }
}

async function buildElement() {
  const files = [
    `./dist/${PROJECT}/runtime.js`,
    `./dist/${PROJECT}/polyfills.js`,
    `./dist/${PROJECT}/scripts.js`,
    `./dist/${PROJECT}/main.js`,
  ];

  try {
    await fs.ensureDir(`./dist/videoflo-webcomponent`);
    await concat(files, `./dist/videoflo-webcomponent/videoflo-webcomponent.js`)
    await fs.copy(`./dist/${PROJECT}/styles.css`, `./dist/videoflo-webcomponent/videoflo-webcomponent.css`);
    await fs.copy(`./projects/${PROJECT}/package.json`, `./dist/videoflo-webcomponent/package.json`);
  } catch (err) {
    console.error('Error executing build function in videoflo-webcomponent-post-build.js');
    throw err;
  }
}

function replaceText(file, originalText, changedText) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    let result = data.replace(originalText, changedText);

    fs.writeFile(file, result, 'utf8', (err) => {
      if (err) return console.log(err);
    });
  });
}

this.buildWebcomponent();
