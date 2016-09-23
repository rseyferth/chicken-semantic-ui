Chicken.component('ui-dropdown', false, function() {

	this.tagName = 'div';
	this.cssClass = 'ui dropdown';
	
	this.on('added', ($el) => {

		// Multi?
		this.multiple = this.$element.is('.multiple');
		this._updating = false;

		$el.dropdown({
			onChange: (value) => {

				if (this._updating) return;

				if (!this.attributes.valueIsArray) {
					
					// Apply to value
					this.set('value', value);

				}
				
			},
			onAdd: (value) => {

				if (this._updating) return;
				if (this.attributes.valueIsArray) {
					this.get('value').add(value);
				}

			},
			onRemove: (value) => {

				if (this._updating) return;
				if (this.attributes.valueIsArray) {
					this.get('value').delete(value);
				}

			}
		});

		// Whenever the value changes
		let applyValue = () => {
			
			// Get value
			this._updating = true;		// To prevent feedback loop
			let value = this.get('value');
			if (this.attributes.valueIsArray) {
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