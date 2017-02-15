/**
 * This component uses the following package:
 *	http://www.dropzonejs.com/
 */
let DropzoneComponent = Chicken.component('ui-dropzone', 'semantic-ui:addons.dropzone', function() {

	///////////////////
	// Configuration //
	///////////////////

	this.cssClass = 'ui selection dropdown dropzone';
	this.defaults({
		
		dzMaxFilesize: 32,
		dzFilesizeBase: 1000,
		dzParamName: 'file',
		dzUploadMultiple: false,
		dzAcceptedFiles: null,

		multiple: false,

		value: false

	});

	// Stats
	this.set('files', [], true);
	

	//////////////////////
	// Dropzone options //
	//////////////////////

	this.options = $.extend({

		addedfile: (file) => {

			// Real file, or mock?
			let data;
			if (file instanceof File) {

				// File from browser
				data = {
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
				};

			} else {

				// File from api
				data = {
					file: file,
					name: file.name,
					size: 100000,
					complete: true,
					canceled: false,
					success: true,
					errorMessage: false,
					uploading: false,
					progress: 100,
					bytesSent: 100,
					thumbnailBase64: false,
					model: null
				};

			}

			// Create a 'model'
			let model = Chicken.observable(data);
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

	}, DropzoneComponent.Config, this.getAttributes('dz'));


	// Multple / single
	if (this.options.maxFiles === undefined) {
		this.options.maxFiles = this.attributes.multiple ? null : 1;
	}


	// Make available in template
	this.set('options', this.options, true);


	// When rendered
	this.when('ready', () => {

		////////////////////////
		// Make the dropzone. //
		////////////////////////

		this.dropzone = new Dropzone(this.$element[0], this.options);

		// Apply existing
		this.applyValue();


	});


	/////////////
	// Actions //
	/////////////

	this.action('deleteFile', (file) => {
		
		// Remove the file
		this.get('files').delete(file);
		this.dropzone.removeFile(file.get('file'));

		// Update
		this.updateValue();
			
	});





}, {

	applyValue() {

		let files = this.get('value');
		if (typeof files === 'string') files = [files];
		if (files instanceof Array) {
			_.each(files, (f) => {
				
				// Add mock file
				let data = {
					name: f,
					size: 12345
				};
				let model = this.dropzone.emit('addedfile', data);
				this.dropzone.emit("thumbnail", data, this.options.url + '/' + f);


			});
		}

	},


	updateValue() {

		// Single?
		if (this.options.multiple) {

			// Set values
			let values = [];
			this.get('files').each((file) => {
				if (file.get('model')) {
					values.push(file.get('model').get(this.options.modelValueAttribute))
				}
			});
			this.set('value', values, true);

		} else {
		
			// Get first
			if (this.get('files').length === 0) {
				this.set('value', null);
			} else {
				let file = this.get('files').first();
				
				if (file.get('model')) {
					this.set('value', file.get('model').get(this.options.modelValueAttribute));					
				} else {
					this.set('value', null);
				}

			}

		}


	}





});

DropzoneComponent.ComponentCallbacks = [

	'accept',
	'renameFilename',
	'fallback',
	'resize',
	'init'

];

// Global configuration
DropzoneComponent.Config = {

	url: '/',
	modelValueAttribute: 'path',
	thumbnailWidth: 290,
	thumbnailHeight: 290

};
