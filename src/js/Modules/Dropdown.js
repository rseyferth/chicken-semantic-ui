Chicken.component('ui-dropdown', 'semantic-ui:modules.dropdown', function() {

	this.tagName = 'div';
	this.cssClass = 'ui dropdown';
	
	this.on('added', ($el) => {

		// Create options
		let options = $.extend({

			useModelAsValue: false

		}, this.attributes);

		// Move validation data to hidden input
		this.$hidden = this.$element.find('input[type="hidden"]');
		let dv = this.$element.attr('data-validate');
		if (dv) {
			this.$element.removeAttr('data-validate');
			this.$hidden.attr('data-validate', dv)
		}
		let name = this.$element.attr('name');
		if (name) {
			this.$hidden.attr('name', name);
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
				
				// Use model?
				if (options.useModelAsValue) {
					value = this.modelMap[value];
				}

				// Apply to value
				this.set('value', value);

			}
			
		};
		options.onAdd = (value) => {

			if (this._updating) return;
			if (this.attributes.valueIsArray) {
				if (!this.get('value')) {
					this.set('value', [], true);
				} else if (!(this.get('value') instanceof Chicken.Core.ObservableArray)) {
					this.set('value', new Chicken.Core.ObservableArray(this.get('value')));
				}
				console.log(this.get('value'));
				this.get('value').add(value);
			}

		};
		options.onRemove = (value) => {

			if (this._updating) return;
			if (this.attributes.valueIsArray) {
				this.get('value').delete(value);
			}

		};

		////////////////
		// Atrributes //
		////////////////

		let nameAttribute = options.nameAttribute || 'name';
		let valueAttribute = options.valueAttribute || 'value';
		let textAttribute = options.textAttribute || 'text';
		

		////////////////////
		// Remote source? //
		////////////////////

		this.modelMap = {};
		if (this.attributes.source) {

			// Get api
			let apiKey = this.attributes.apiKey ? this.attributes.apiKey : null;
			let api = Chicken.app.api(apiKey);
			
			// Make request
			let request = new SemanticApiRequest(api, this.attributes.source);

			// Check key, name, and value attribute
			if (this.attributes.nameAttribute && !this.attributes.textAttribute) {
				textAttribute = nameAttribute;
			}

			// Convert the response from the API
			options.apiSettings = request.convertResponse((response) => {

				return response.map((model) => {
				
					// Store the model itself
					if (options.useModelAsValue) {
						this.modelMap[model.get(valueAttribute)] = model;
					}

					// Convert to semantic format
					return {
						name: model.get(nameAttribute),
						value: model.get(valueAttribute),
						text: model.get(textAttribute)
					}

				});

			}).toSemantic({
				
				cache: options.cache || false

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

			// Is it a model not in the map?
			if (value instanceof Chicken.Data.Model) {

				// Get info from the model
				$el.dropdown('set text', value.get(textAttribute));
				$el.dropdown('set value', value.get(valueAttribute));				

			} else {

				// Apply
				$el.dropdown('set exactly', value);

			}

			this._updating = false;

		};
		this.observe('value', applyValue);
		

		// Initial value?
		applyValue();

	});

});