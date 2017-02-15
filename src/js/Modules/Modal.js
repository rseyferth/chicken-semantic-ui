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
		uiQueue: false,
		overrideButtonBehaviour: false
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

		//override default button behaviour ?
		if (this.get('overrideButtonBehaviour')) {
			this.$element.modal({
				onApprove: function() {
					return false;
				},
				onDeny: function() {
					return false;
				}
			});
		}


	},

	show() {

		this._initialize();
		this.$element.modal('show');

	},

	hide() {
		this.$element.modal('hide');
	}

});