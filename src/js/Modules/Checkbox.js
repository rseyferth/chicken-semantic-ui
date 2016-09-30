Chicken.component('ui-checkbox', false, function() {

	this.tagName = 'div';
	this.cssClass = 'ui checkbox';
	
	this.on('added', ($el) => {
		
		$el.checkbox();

	});

});