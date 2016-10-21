/**
 * This component uses the following package:
 *	http://www.dropzonejs.com/
 */

let CmpDropzone = Chicken.component('ui-dropzone', 'semantic-ui:addons.dropzone', function() {

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
				bytesSent: 0,
				thumbnailBase64: false,
				model: null
			});
			file.model = model;
			this.get('files').add(model);
			
		},

		thumbnail: (file, dataUrl) => {

			// Store on file
			file.model.set('thumbnailBase64', dataUrl);

			
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

		success: (file, response) => {

			// Deserialize response
			try {
				response = Chicken.app.api(this.get('api')).deserialize(response);
			} catch (error) {
				file.model.set('errorMessage', typeof error === 'string' ? error : error.message);
				file.model.set('success', false);
				file.model.set('complete', true);
				return;
			}
			
			// Apply
			file.model.set('success', true);
			file.model.set('complete', true);
			file.model.set('model', response);

			// Update
			updateValue();
			
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

	}, CmpDropzone.Config, this.attributes);


	// Multple / single
	if (options.maxFiles === undefined) {
		options.maxFiles = this.attributes.multiple ? null : 1;
	}

	// Start with a list of files
	let value = this.get('value');
	
	let updateValue = () => {

		// Single?
		if (options.multiple) {

			// Set values
			let values = [];
			this.get('files').each((file) => {
				if (file.get('model')) {
					values.push(file.get('model').get(options.modelValueAttribute))
				}
			});
			this.set('value', values, true);

		} else {
			// Get first
			if (this.get('files').length === 0) {
				this.set('value', null);
			} else {
				let file = this.get('files.0');
				if (file.get('model')) {
					this.set('value', file.get('model').get(options.modelValueAttribute));					
				} else {
					this.set('value', null);
				}
			}

		}


	};





	// Make available in template
	this.set('options', options, true);

	// When rendered
	this.when('ready', () => {

		////////////////////////
		// Make the dropzone. //
		////////////////////////

		this.dropzone = new Dropzone(this.$element[0], options);

	});

	/////////////
	// Actions //
	/////////////

	this.action('deleteFile', (file) => {
		
		// Remove the file
		this.get('files').delete(file);
		this.dropzone.removeFile(file.get('file'));

		// Update
		updateValue();
			
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
CmpDropzone.Config = {

	modelValueAttribute: 'path',
	thumbnailWidth: 290,
	thumbnailHeight: 290

};
