Chicken.component('model-form', 'semantic-ui:chicken.model-form', function() {

	this.tagName = 'form';
	this.cssClass = 'ui form';


	this.when('ready', () => {

		// Get validation for model
		let formKey = this.get('key');
		if (!formKey) formKey = 'default';
		let rules = this.get('model').getValidationRules(formKey);
		this.$element.form({ 

			on: 'blur',
			inline: true,
			fields: rules,
			focusInvalid: true,

			onSuccess: (event) => {

				event.preventDefault();
				this.sendAction('save');

			}

		});

		// Prevent default form submission
		this.$element.on('submit', (e) => {
			e.preventDefault();
		});

	});




	this.action('save', () => {

		// Set to busy
		this.set('error', false);
		this.$element.addClass('loading');

		// Go and save it
		this.get('model').save({

			uri: this.get('uri')

		}).then((result) => {

			this.$element.removeClass('loading');

		}, (error) => {

			// Show the error
			this.set('error', error.getMessage());

			// No longer loading
			this.$element.removeClass('loading');

		});

	});



});