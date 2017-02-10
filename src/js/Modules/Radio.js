Chicken.component('ui-radio', false, function() {

	let self = this;

	this.defaults({ 
		useModelAsValue: false
	});


	this.on('added', ($el) => {

		// Enable all checkboxes
		let fieldsByValue = {};
		let $fields = this.$element.find('.ui.checkbox')
			.checkbox({
				
				onChange: function(...args)  {
					
					// Set value
					let $checkbox = $(this);
					let value = $checkbox.val();
					

					if (self.get('useModelAsValue') && self.get('sourceCollection') && self.get('valueAttribute')) {
						value = self.get('sourceCollection').find(self.get('valueAttribute'), $checkbox.val());
					}

					if (!value) return;

					self.set('value', value);
					
				}

			})
			.each((index, el) => {
				let $el = $(el);
				let $input = $el.find('input[type="checkbox"],input[type="radio"]');
				fieldsByValue[$input.val()] = $el;				
			});			

		// Watch for change in value
		let applyValue = () => {

			let value = this.get('value');
			if (!value) return;			

			// getvalueAttribute from value if model is used
			if (this.get('useModelAsValue') && this.get('valueAttribute')) {
				value = this.get('value').get(this.get('valueAttribute'));
			}

			let field = fieldsByValue[value];
			if (field) field.checkbox('check');

		};
		this.observe('value', applyValue);
		applyValue();

	});

});