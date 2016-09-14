Chicken.component('ui-accordion', false, function() {

	this.tagName = 'div';
	this.cssClass = 'ui accordion';
	
	this.on('added', ($el) => {
		$el.accordion();
	});

});