Chicken.component('ui-modal', false, function() {
	
	this.cssClass = 'ui modal';

	this.defaults({
		uiDetachable: true,
		uiAutofocus: true,
		uiObserveChanges: false,
		uiAllowMultiple: false,
		uiKeyboardShortcuts: true,
		uiOffset: 0,
		uiContent: 'body',
		uiClosable: true,
		uiDimmerSettings: {
			closable: false,
			useCSS: true
		},
		uiTransition: 'scale',
		uiDuration: 400,
		uiQueue: false
	});

	
	this.when('ready', () => {

		

	});

	
}, {
	
	_initialize() {
		
		// Already done?
		if (this.isInitialized) return;
		this.isInitialized = true;

		// Make modal
		let config = ChickenSemantic.getUiOptions(this);
		this.$element.modal(config);

	},

	show() {

		this._initialize();
		this.$element.modal('show');

	}

});