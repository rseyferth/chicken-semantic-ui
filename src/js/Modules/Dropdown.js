Chicken.component('ui-dropdown', 'semantic-ui:modules.dropdown', function() {

	///////////////////
	// Configuration //
	///////////////////

	this.tagName = 'div';
	this.cssClass = 'ui dropdown';

	this.defaults({ 
	
		nameAttribute: 'name',
		valueAttribute: 'value',
		textAttribute: 'name',


		useModelAsValue: false,
		additionModel: false,
		
		source: false,

		onSelect: false,
		clearAfterSelection: false,

		// Semantic options
		uiOn: 'click',
		uiAllowReselection: false,
		uiAllowAdditions: false,
		uiHideAdditions: true,
		//uiAction: auto,
		uiMinCharacters: 1,
		uiMatch: 'both',
		uiSelectOnKeyDown: true,
		uiForceSelection: false,
		uiAllowCategorySelection: false,
		//uiPlaceholder: auto

	});
	


	//////////
	// Data //
	//////////

	this.modelMap = {};
	this.beforeRender(() => {
		
		// Collection given?
		if (this.get('source') instanceof Chicken.Data.Collection) {

			// Set source
			let updateSource = () => {

				// Render it in the view
				this.set('dropdownRecords', this.get('source'));
				this.set('useDropdownRecords', true);

				// Create model map
				if (this.get('useModelAsValue')) {
					this.modelMap = {};
					this.get('source').each((model) => {
						this.modelMap[model.get(this.get('valueAttribute'))] = model;
					});
				}

			};
			updateSource();

		
		}

	});


	///////////////
	// Behaviour //
	///////////////

	this.on('added', ($el) => {

		// Create options
		let options = this.getAttributes('ui');

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
		

		
		////////////
		// Events //
		////////////

		options.onChange = (value, text, $addedChoice) => {

			// Same as last?
			if (this._updating) return;
			if (value === this.get('value')) return;
			
			// Selected?
			if (this.get('onSelect')) {

				// Send the action
				this.sendAction(this.get('onSelect'), [value, text]);

			}

			// Clear?
			if (this.get('clearAfterSelection')) {
				this.set('value', null);
				return;
			}

			if (!this.get('valueIsArray') && $addedChoice) {
				
				// Use model?
				if (this.get('useModelAsValue')) {
					
					// Custom addition?
					if ($addedChoice.is('.addition')) {

						// Create new model instance!
						let modelClass = this.get('additionModel');
						if (modelClass) {
							modelClass = Chicken.model(modelClass);
						} else {
							modelClass = Chicken.Data.Model;
						}

						// Create it
						let model = new modelClass();
						model.set(this.get('nameAttribute'), text);
						value = model;

					} else {

						// Look it up
						value = this.modelMap[value];

					}

				}

				// Apply to value
				this.set('value', value);

			}
			
			
		};
		options.onAdd = (value) => {

			if (this.get('valueIsArray')) {
			
				// Initialized array?
				if (!this.get('value')) {
					
					// Create observable array
					this.set('value', [], true);

				} else if (!(this.get('value') instanceof Chicken.Core.ObservableArray)) {

					// Make it into an observable array
					this.set('value', new Chicken.Core.ObservableArray(this.get('value')));

				}

				// Already in there?
				if (this.get('value').find(v => v === value)) return;
				
				// Add the new value
				this.get('value').add(value);

			}

		};
		options.onRemove = (value) => {

			if (this.attributes.valueIsArray) {
				this.get('value').delete(value);
			}

		};


		///////////////////
		// Source given? //
		///////////////////

		if (this.get('source')) {

			// Remote source (url)?
			if (typeof this.get('source') === 'string') {

				// Get api
				let apiKey = this.attributes.apiKey ? this.attributes.apiKey : null;
				let api = Chicken.app.api(apiKey);
				
				// Make request
				let request = new SemanticApiRequest(api, this.attributes.source);

				// Convert the response from the API
				options.apiSettings = request.convertResponse((response) => {

					return response.map((model) => {
					
						// Store the model itself
						if (this.get('useModelAsValue')) {
							this.modelMap[model.get(this.get('valueAttribute'))] = model;
						}

						// Convert to semantic format
						return {
							name: model.get(this.get('nameAttribute')),
							value: model.get(this.get('valueAttribute')),
							text: model.get(this.get('textAttribute'))
						}

					});

				}).toSemantic({
					
					cache: options.cache || false

				});

			}

		}

		///////////////
		// Create it //
		///////////////
		
		$el = $($el);
		$el.dropdown(options);
		



		////////////////////////////////
		// Whenever the value changes //
		////////////////////////////////

		let applyValue = () => {
			
			// Get value
			let value = this.get('value');
			if (this.attributes.valueIsArray && value && value.toArray) {
				value = value.toArray();
			}

			// Same as current?
			let oldValue = $el.dropdown('get value');
			if (this.get('valueIsArray')) {
				
				// Compare arrays
				oldValue = oldValue.split(/,/);
				if (_.intersection(oldValue, value).length === oldValue.length) return;

			} else {

				// Compare textually
				if (oldValue === value) return;
				
			}

			// Updating
			this._updating = true;
			
			// Is it a model not in the map?
			if (value instanceof Chicken.Data.Model) {

				// Get info from the model
				$el.dropdown('set text', value.get(this.get('textAttribute')));
				$el.dropdown('set value', value.get(this.get('valueAttribute')));

			} else {

				// Not an array?
				if (!this.get('valueIsArray')) value = `${value}`;

				// Apply
				$el.dropdown('set exactly', value);

			}

			// Done.
			this._updating = false;

		};
		this.observe('value', applyValue);
		

		// Initial value?
		applyValue();

	});

});
