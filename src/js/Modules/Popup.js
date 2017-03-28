Chicken.component('ui-popup', false, function() {

	///////////////////
	// Configuration //
	///////////////////

	this.defaults({

		// https://semantic-ui.com/modules/popup.html#/settings
		uiPopup: false,
		uiExclusive: false,
		uiMovePopup: true,
		uiObserveChanges: true,
		uiBoundary: window,
		uiContext: $('body'),
		uiScrollContext: window,
		uiJitter: 2,
		uiPosition: 'top left',
		uiInline: false,
		uiPreserve: false,
		uiPrefer: 'adjacent',
		uiLastResort: false,
		uiOn: 'hover',
		uiDelay: {
			show: 50,
			hide: 0
		},
		uiTransition: 'slide down',
		uiDuration: 200,
		uiSetFluidWidth: true,
		uiHoverable: false,
		uiClosable: true,
		uiAddTouchEvents: true,
		uiHideOnScroll: 'auto',
		uiTarget: false,
		uiDistanceAway: 0,
		uiOffset: 0,
		uiMaxSearchDepth: 10

	});


	///////////////
	// Behaviour //
	///////////////

	this.when('ready', () => {

		// Activate
		let options = this.getAttributes('ui');
console.log(options);
		options.onShow = (...args) => {
			console.log(args);
		};

		this.$element.popup(options);




	});

}, {

});