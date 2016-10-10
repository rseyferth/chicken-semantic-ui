Chicken.component('ui-checkbox', false, function() {

	this.tagName = 'div';
	this.cssClass = 'ui checkbox';
	
	this.on('added', ($el) => {
		
		$el.checkbox();

	});

	// Initialize the checked value
	if (!this.get('checked')) this.set('checked', false);

});