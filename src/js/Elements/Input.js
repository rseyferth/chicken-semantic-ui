Chicken.component('ui-input', false, function() {

	this.tagName = 'input';
	
	

	this.on('added', () => {

		////////////////////////////////
		// Whenever the value changes //
		////////////////////////////////
		
		this._updating = false;
		this.$element.on('change blur', () => {

			// Not updating...
			if (this._updating) return;

			// Set it
			this.set('value', this.$element.val());

		});

		let applyValue = () => {
			
			// Get value
			this._updating = true;		// To prevent feedback loop
			this.$element.val(this.get('value'));
			this._updating = false;
							
		};
		this.observe('value', applyValue);
		applyValue();

	});

	
});