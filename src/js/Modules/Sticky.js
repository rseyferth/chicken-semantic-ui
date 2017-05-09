Chicken.component('ui-sticky', false, function() {

	///////////////////
	// Configuration //
	///////////////////

	this.cssClass = 'ui sticky';
	this.defaults({

		// https://semantic-ui.com/modules/sticky.html#/settings
		uiPushing: false,
		uiJitter: 5,
		uiObserveChanges: false,
		uiContext: false,
		uiScrollContext: window,
		uiOffset: 0,
		uiBottomOffset: 0
	});

	///////////////
	// Behaviour //
	///////////////

	this.when('ready', () => {

		this.$element.sticky(this.getAttributes('ui'));

	});


}, {

});