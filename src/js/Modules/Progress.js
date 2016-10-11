Chicken.component('ui-progress', false, function() {

	this.tagName = 'div';
	this.cssClass = 'ui progress';

	this.observe('error', () => {

		// Toggle class
		this.$element.toggleClass('error', this.get('error').length > 0);

	});

	this.on('added', ($el) => {
		
		$el.progress({
			value: this.get('value')
		});

		
		// Toggle class
		this.$element.toggleClass('error', this.get('error').length > 0);

	});

	this.observe('value', () => {

		this.$element.progress({
			value: this.get('value')
		});
		
	});

});