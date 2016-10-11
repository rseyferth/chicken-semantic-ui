/**
 * This component uses the following package:
 *	http://www.dropzonejs.com/
 */

let Component = Chicken.component('ui-dropzone', 'semantic-ui:addons.dropzone', function() {

	this.cssClass = 'ui selection dropdown dropzone';

	// Stats
	this.set('files', [], true);


	//////////////////////
	// Dropzone options //
	//////////////////////

	let options = $.extend({

		addedfile: (file) => {

			// Create a 'model'
			let model = Chicken.observable({
				file: file,
				name: file.name,
				size: file.size,
				complete: false,
				canceled: false,
				success: false,
				errorMessage: false,
				uploading: true,
				progress: 0,
				bytesSent: 0
			});
			file.model = model;
			this.get('files').add(model);
			
		},

		thumbnail: (file, dataUrl) => {
			console.log('thumbnail', file, dataUrl);
		},

		uploadprogress: (file, progress, bytesSent) => {

			// Update 
			file.model.set('progress', progress);
			file.model.set('bytesSent', bytesSent);

		},

		error: (file, error) => {

			file.model.set('errorMessage', typeof error === 'string' ? error : error.message);
			file.model.set('success', false);
			file.model.set('complete', true);

		},

		sending: (file, xhr, formData) => {

			// Get ajax options from API
			let api = Chicken.app.api(this.get('api'));
			if (api) {
				let auth = api.getAuth();
				if (auth) {
					let beforeSend = auth.getAjaxOptions().beforeSend;
					if (beforeSend) {
						beforeSend(xhr);
					}
				}
			}

		},

		reset: () => {

		}

	}, Component.Config, this.attributes);


	// Make available in template
	this.set('options', options, true);

	// When rendered
	this.when('ready', () => {

		////////////////////////
		// Make the dropzone. //
		////////////////////////

		this.$element.dropzone(options);


	});

	/////////////
	// Actions //
	/////////////

	this.action('deleteFile', (file) => {
		this.get('files').delete(file);
	});




});

let ComponentCallbacks = [

	'accept',
	'renameFilename',
	'fallback',
	'resize',
	'init'

];

// Global configuration
Component.Config = {

	

};
