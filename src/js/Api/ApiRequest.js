class SemanticApiRequest 
{

	constructor(api, uri) {

		this.api = api;
		this.uri = uri;

		this.auth = null;


	}

	toSemantic(options = {}) {

		// Basics
		let apiOptions = {
			url: this.api.makeUrl(this.uri)
		};

		// Check auth
		let auth = this.auth ? this.auth : this.api.getAuth();
		if (auth) {
			let ajaxOptions = auth.getAjaxOptions();
			if (ajaxOptions.beforeSend) {
				apiOptions.beforeXHR = ajaxOptions.beforeSend;
			}
		}

		// Parse response
		apiOptions.onResponse = (response) => {

			return this._convertApiResponse(response);
			
		};

		// Combine
		$.extend(apiOptions, options);

		// Done
		return apiOptions;

	}

	convertResponse(callback) {
		this.convertResponseCallback = callback;
		return this;
	}


	_convertApiResponse(response) {

		// Parse it
		let data = this.api.deserialize(response);

		// Map to semantic format
		let result = {
			success: true
		};

		// Conversion defined?
		if (this.convertResponseCallback) {

			// Convert it
			result.results = this.convertResponseCallback.apply(this, [data]);

		} else {

			// Collection or model?
			if (data instanceof Chicken.Data.Model) {

				// To object
				result.results = data.toObject();
			
			} else {

				// To array
				result.results = data.toArray();

			}


		}

		return result;

	}


};