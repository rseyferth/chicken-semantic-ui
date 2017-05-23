Chicken.component('ui-menu', false, function() {

	///////////////////
	// Configuration //
	///////////////////

	this.defaults({

		value: false

	});


	///////////////
	// Behaviour //
	///////////////

	this.when('ready', () => {

		// Index items
		this.indexItems();

		// Selection!
		this.observe('value', () => {

			// Apply selected
			this.applyValue();

		});
		this.applyValue();

	});




}, {

	////////////////////
	// Public methods //
	////////////////////

	indexItems() {

		// Find items
		this.items = [];
		this.$items = $(this.$element).find('.item').each((index, el) => {

			// Add it
			let $el = $(el);
			this.items.push({
				$element: $el,
				value: this._getValue($el)
			});

		});

		// Click event
		this.$items.on('click', (e) => {
			e.preventDefault();

			// Get value
			this.set('value', this._getValue($(e.target)));

		});

	},

	applyValue() {

		// Toggle item activeness
		_.each(this.items, (item) => {

			item.$element.toggleClass('active', item.value === this.get('value'));

		});

	},


	_getValue($el) {
		return $el.data('value') || $el.text();
	}


});