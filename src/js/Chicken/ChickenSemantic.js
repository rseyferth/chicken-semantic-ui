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

	}


};