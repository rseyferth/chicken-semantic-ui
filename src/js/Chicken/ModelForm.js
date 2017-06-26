Chicken.component('model-form', 'semantic-ui:chicken.model-form', function() {

	this.tagName = 'form';
	this.cssClass = 'ui form';

	this.defaults({

		onSaved: false

	});


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

			showLoadingIndicator: true,
			showLoadingIndicatorAfterSuccess: false,

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
		if (this.get('showLoadingIndicator')) this.$element.addClass('loading');

		// Clear errors
		this.$element.find('.error').removeClass('error').find('.prompt').remove();

		// Go and save it
		this.get('model').save({

			uri: this.get('uri')

		}).then((result) => {

			if (!this.get('showLoadingIndicatorAfterSuccess')) this.$element.removeClass('loading');

			if (this.get('onSaved')) this.sendAction(this.get('onSaved'), [result]);

		}, (error) => {

			// Check errors
			window.ChickenSemantic.applyApiErrorToForm(this.$element, error);

			// Show the error
			this.set('error', error.getMessage());

			// No longer loading
			this.$element.removeClass('loading');

		});

	});



});