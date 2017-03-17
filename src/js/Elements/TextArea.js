Chicken.component('ui-textarea', false, function() {

	this.tagName = 'textarea';


	this.on('added', () => {

		////////////////////////////////
		// Whenever the value changes //
		////////////////////////////////
		
		this._hasFocus = false;
		this.$element.on('focus', () => {
			this._hasFocus = true;
		});
		this.$element.on('blur', () => {
			this._hasFocus = false;
		});

		this.$element.on('change keyup paste', () => {

			// Set it
			let text = this.$element.val();
			if (this.get('value') !== text) {
				this.set('value', text);
			}

		});

		let applyValue = () => {
			
			// Get value
			let text = this.get('value');
			if (this.$element.val() !== text && !this._hasFocus) {
				this.$element.val(this.get('value'));
			}
							
		};
		this.observe('value', applyValue);
		applyValue();

	});

	
});