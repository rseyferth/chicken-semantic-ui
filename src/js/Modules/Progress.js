Chicken.component('ui-progress', false, function() {

	this.tagName = 'div';
	this.cssClass = 'ui progress';
	
	this.on('added', ($el) => {
		
		$el.progress({
			value: this.get('value')
		});

	});

	this.observe('value', () => {

		this.$element.progress({
			value: this.get('value')
		});
		
	});

});