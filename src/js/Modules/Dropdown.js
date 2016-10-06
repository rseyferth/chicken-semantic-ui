Chicken.component('ui-dropdown', 'semantic-ui:modules.dropdown', function() {

	this.tagName = 'div';
	this.cssClass = 'ui dropdown';
	
	this.on('added', ($el) => {

		// Create options
		let options = {};

		// Move validation data to hidden input
		this.$hidden = this.$element.find('input[type="hidden"]');
		let dv = this.$element.attr('data-validate');
		if (dv) {
			this.$element.removeAttr('data-validate');
			this.$hidden.attr('data-validate', dv)
		}

		// Multi?
		this.multiple = this.$element.is('.multiple');
		
		// Prevent observer-loops
		this._updating = false;


		////////////
		// Events //
		////////////

		options.onChange = (value) => {

			if (this._updating) return;

			if (!this.attributes.valueIsArray) {
				
				// Apply to value
				this.set('value', value);

			}
			
		};
		options.onAdd = (value) => {

			if (this._updating) return;
			if (this.attributes.valueIsArray) {
				this.get('value').add(value);
			}

		};
		options.onRemove = (value) => {

			if (this._updating) return;
			if (this.attributes.valueIsArray) {
				this.get('value').delete(value);
			}

		};

		////////////////////
		// Remote source? //
		////////////////////

		if (this.attributes.source) {

			// Get api
			let apiKey = this.attributes.apiKey ? this.attributes.apiKey : null;
			let api = Chicken.app.api(apiKey);
			
			// Make request
			let request = new SemanticApiRequest(api, this.attributes.source);

			// Check key, name, and value attribute
			let nameAttribute = this.attributes.nameAttribute ? this.attributes.nameAttribute : 'name';
			let valueAttribute = this.attributes.valueAttribute ? this.attributes.valueAttribute : 'value';
			let textAttribute = this.attributes.textAttribute ? this.attributes.textAttribute : 'text';
			if (this.attributes.nameAttribute && !this.attributes.textAttribute) {
				textAttribute = nameAttribute;
			}

			// Apply
			options.apiSettings = request.convertResponse((response) => {

				return response.map((model) => {
				
					return {
						name: model.get(nameAttribute),
						value: model.get(valueAttribute),
						text: model.get(textAttribute)
					}

				});

			}).toSemantic({
				cache: false
			});


		}

		// Min-chars search
		options.minCharacters = this.getAttribute('minCharacters', 1);

		///////////////
		// Create it //
		///////////////
		
		$el.dropdown(options);
		
		
		////////////////////////////////
		// Whenever the value changes //
		////////////////////////////////
		
		let applyValue = () => {
			
			// Get value
			this._updating = true;		// To prevent feedback loop
			let value = this.get('value');
			if (this.attributes.valueIsArray && value && value.toArray) {
				value = value.toArray();
			}

			// Apply
			$el.dropdown('set exactly', value);
			this._updating = false;
			
		};
		this.observe('value', applyValue);
		applyValue();

	});

});