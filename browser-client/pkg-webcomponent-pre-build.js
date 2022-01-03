const fs = require('fs-extra');
const PROJECT = 'videoflo-browser-client';

module.exports.prepareWebcomponent = function () {
	console.log('Preparing webcomponent files ...');
	const appModule = `./projects/${PROJECT}/src/app/app.module.ts`;
	replaceText(appModule, 'bootstrap: [AppComponent]', '// bootstrap: [AppComponent]');
};

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

this.prepareWebcomponent();
