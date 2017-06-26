Chicken.component('ui-modal', false, function() {

	///////////////////
	// Configuration //
	///////////////////
	
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
		
		overrideButtonBehaviour: false,

		autoShow: false,
		autoCenter: false,
		autoCenterSelf: true,	// When I render myself, center again

		// Custom template url
		template: false

	});

	////////////////////////////
	// Inject custom template //
	////////////////////////////
	// Get source for view
	if (this.get('template')) {
	
		// Find it
		let cache = Chicken.Dom.View.TemplateCache;
		if (!cache.has(this.get('template'))) throw new Error(`There is no View template cached with the key "${this.get('template')}"`);
		this.templateString = cache.get(this.get('template'));

	}


	

	///////////////
	// Behaviour //
	///////////////

	this.when('ready', () => {

		// Auto-show?
		if (this.get('autoShow')) {
			this.show();
		}

		// Center?
		if (this.get('autoCenter')) {
			
			// When revalidated
			let knownComponents = [];
			this.on('revalidate', () => {

				// Check child components
				_.each(this.components, (comp, key) => {

					// Already known?
					if (_.contains(knownComponents, key)) return;
					knownComponents.push(key);

					// Listen
					comp.on('revalidate', () => {
						this.refreshIfSizeChanged();
					});
				});

				// Refresh it
				this.refreshIfSizeChanged();
				
			});

		} else if (this.get('autoCenterSelf')) {

			// Watch me.
			this.on('revalidate', () => {
				this.refreshIfSizeChanged();
			});

		}

	});

	
}, {
	
	_initialize() {
		
		
		// Already done?
		if (this.isInitialized) return;
		this.isInitialized = true;

		// Make modal
		let config = ChickenSemantic.getUiOptions(this);

		// Override default button behaviour ?
		if (this.get('overrideButtonBehaviour')) {
			
			config.onApprove = () => { return false; }
			config.onDeny = () => { return false; }

		} else {

			config.onApprove = () => {

				// Callback?
				if (this._approveCallback) {
					if (this._approveCallback() === false) return false;
				}

				// Done
				if (this._showResolve) this._showResolve();
				
			};
			config.onDeny = () => {

				// Callback?
				if (this._denyCallback) {
					if (this._denyCallback() === false) return false;
				}

				// Done
				if (this._showReject) this._showReject();

			};
			config.onHide = () =>{

				// Done
				if (this._showReject) this._showReject();

			};

		}


		// Init modal
		this.$element.modal(config);

	},

	show(approveCallback = null, denyCallback = null) {

		// Initialize
		this._initialize();

		// Store callbacks
		this._approveCallback = approveCallback;
		this._denyCallback = denyCallback;

		// Show it
		this.modalIsShowing = true;
		this.$element.modal('show');

		// Fix scrolling bug.
		$(".ui.dimmer.modals").css("overflow-y", "auto");

		// Create result promise
		return new Promise((resolve, reject) => {
			this._showResolve = resolve;
			this._showReject = reject;
		});

	},

	hide() {
		this.modalIsShowing = false;
		this.$element.modal('hide');
	},
	
	refresh() {
		if (this._refreshTimeout || !this.modalIsShowing) return;

		this._refreshTimeout = setTimeout(() =>{
			this.$element.modal('refresh');
			this._refreshTimeout = false;	
		}, 10);
	},

	refreshIfSizeChanged() {

		// Not showing?
		if (!this.modalIsShowing) return;

		// Check current size
		let currentSize = `${this.$element.width()}x${this.$element.height()}`;
		if (currentSize !== this.previousSize) {
			this.refresh();
			this.previousSize = currentSize;
		}

	},

	setLoading(isLoading = true) {
		this.$element.toggleClass('loading', isLoading);
	}

});