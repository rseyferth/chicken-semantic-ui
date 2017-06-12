Chicken.component('ui-tabs', 'semantic-ui:modules.tabs', function() {

	///////////////////
	// Configuration //
	///////////////////

	this.defaults({

		showMenu: true,
		menuClass: 'ui tabular menu'

	});


	///////////////
	// Behaviour //
	///////////////

	this.when('ready', () => {

		// Index tabs
		let tabs = new Chicken.Core.ObservableArray();
		let active = true;
		_.each(this.components, (component, id) => {
			
			// Create info
			let info = new Chicken.Core.Observable({
				id: id,
				title: component.get('title'),
				active: active
			});
			active = false;
			tabs.add(info);

			// Set id on the component
			component.$element.attr('data-tab', id);

			// Active?
			if (info.get('active')) component.$element.addClass('active');

		});
		this.set('tabs', tabs);

		// Go!
		this.on('revalidate', () => {

			$(this.$element).find('.menu .item').tab();

		});

	});

}, {

});