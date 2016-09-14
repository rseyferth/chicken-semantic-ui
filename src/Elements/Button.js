Chicken.component('ui-button', false, function() {

	this.tagName = 'button';
	this.cssClass = 'ui button';
	
	this.dom.on('click', () => {
	
		this.sendAction();
	
	});


});