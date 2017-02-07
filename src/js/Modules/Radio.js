Chicken.component('ui-radio', false, function() {

	let self = this;

	this.on('added', ($el) => {
		
		// Enable all checkboxes
		let fieldsByValue = {};
		let $fields = this.$element.find('.ui.checkbox')
			.checkbox({
				
				onChange: function(...args)  {
					
					// Set value
					let $checkbox = $(this);
					self.set('value', $checkbox.val());
					
				}

			})
			.each((index, el) => {
				let $el = $(el);
				let $input = $el.find('input[type="checkbox"],input[type="radio"]');
				fieldsByValue[$input.val()] = $el;				
			});			

		// Watch for change in value
		let applyValue = () => {

			// Find input and set it checked
			let field = fieldsByValue[this.get('value')];
			if (field) field.checkbox('check');

		};
		this.observe('value', applyValue);
		applyValue();



	});

});