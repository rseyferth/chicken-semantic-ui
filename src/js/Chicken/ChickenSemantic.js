window.ChickenSemantic = {

	applyApiErrorToForm($form, apiError) {

		// Loop errors
		let errors = _.mapObject(apiError.getFormErrors(), (messages, field) => {

			return messages.join(' ');

		});

		// This should work better in the future (new versions of Semantic)		
		//$form.form('add errors', errors);
		_.each(errors, (message, key) => {
			$form.form('add prompt', key, message);
		});

	},


	getUiOptions(component) {

		// Get all keys with uiX
		let options = {};
		_.each(component.attributes, (value, key) => {

			// uiX?
			if (/^ui[A-Z]/.test(key)) {

				// Remove uiX
				key = _.decapitalize(key.replace(/^ui/, ''));

				// Set it
				options[key] = value;

			}

		});

		return options;

	}



};