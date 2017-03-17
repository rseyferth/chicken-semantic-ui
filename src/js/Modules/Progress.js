Chicken.component('ui-progress', false, function() {

	this.tagName = 'div';
	this.cssClass = 'ui progress';

	this.defaults({

		error: '',

		uiAutoSuccess: true,
		uiShowActivity: false,
		uiLimitValues: true,
		uiLabel: 'percent',
		uiPrecision: 1,
		uiTotal: false,

		value: false
		
	});

	this.observe('error', () => {

		// Toggle class
		this.$element.toggleClass('error', this.get('error').length > 0);

	});

	this.on('added', ($el) => {
		
		// Create progress bar
		let attr = this.getAttributes('ui');
		attr.value = this.get('value');
		$el.progress(attr);

		
	});

	this.observe('value', () => {

		this.$element.progress({
			value: this.get('value')
		});
		
	});

});