/**
 * This component uses the following package:
 *	http://www.daterangepicker.com/
 */

let CmpDateRangePicker = Chicken.component('ui-date-range-picker', false, function() {

	this.tagName = 'input';	

	this.on('added', ($el) => {

		// Options
		this.settings = getOptions({

			format: undefined,								// (string) Date format as accepted by Moment
			
			// Daterangepicker settings
			startDate: undefined,								// (Date object, moment object or string) The start of the initially selected date range
			endDate: undefined,									// (Date object, moment object or string) The end of the initially selected date range
			minDate: undefined,									// (Date object, moment object or string) The earliest date a user may select
			maxDate: undefined,									// (Date object, moment object or string) The latest date a user may select
			dateLimit: undefined,								// (object) The maximum span between the selected start and end dates. Can have any property you can add to a moment object (i.e. days, months)
			showDropdowns: undefined,							// (boolean) Show year and month select boxes above calendars to jump to a specific month and year
			showWeekNumbers: undefined,							// (boolean) Show localized week numbers at the start of each week on the calendars
			showISOWeekNumbers: undefined,						// (boolean) Show ISO week numbers at the start of each week on the calendars
			timePicker: undefined,								// (boolean) Allow selection of dates with times, not just dates
			timePickerIncrement: undefined,						// (number) Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30)
			timePicker24Hour: undefined,						// (boolean) Use 24-hour instead of 12-hour times, removing the AM/PM selection
			timePickerSeconds: undefined,						// (boolean) Show seconds in the timePicker
			ranges: undefined,									// (object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range
			showCustomRangeLabel: undefined,					// (boolean) Displays an item labeled "Custom Range" at the end of the list of predefined ranges, when the ranges option is used. This option will be highlighted whenever the current date range selection does not match one of the predefined ranges. Clicking it will display the calendars to select a new range.
			alwaysShowCalendars: undefined,						// (boolean) Normally, if you use the ranges option to specify pre-defined date ranges, calendars for choosing a custom date range are not shown until the user clicks "Custom Range". When this option is set to true, the calendars for choosing a custom date range are always shown instead.
			opens: undefined,									// (string: 'left'/'right'/'center') Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to
			drops: undefined,									// (string: 'down' or 'up') Whether the picker appears below (default) or above the HTML element it's attached to
			buttonClasses: 'small button',							// (array) CSS class names that will be added to all buttons in the picker
			applyClass: undefined,								// (string) CSS class string that will be added to the apply button
			cancelClass: undefined,								// (string) CSS class string that will be added to the cancel button
			locale: undefined,									// (object) Allows you to provide localized strings for buttons and labels, customize the date format, and change the first day of week for the calendars. Check off "locale (with example settings)" in the configuration generator to see how to customize these options.
			singleDatePicker: undefined,						// (boolean) Show only a single calendar to choose one date, instead of a range picker with two calendars; the start and end dates provided to your callback will be the same single date chosen
			autoApply: undefined,								// (boolean) Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates or a predefined range is selected
			linkedCalendars: undefined,							// (boolean) When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), and both will be advanced when clicking the left or right arrows above the calendars. When disabled, the two calendars can be individually advanced and display any month/year.
			isInvalidDate: undefined,							// (function) A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.
			isCustomDate: undefined,							// (function) A function that is passed each date in the two calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell.
			autoUpdateInput: true,								// (boolean) Indicates whether the date range picker should automatically update the value of an <input> element it's attached to at initialization and when the selected dates change.
			parentEl: undefined									// (string) jQuery selector of the parent element that the date range picker will be added to, if not provided this will be 'body'

		}, this);
		
		// Locale just a language string?
		if (!this.settings.locale) this.settings.locale = $('html').attr('lang');
		if (!this.settings.locale) this.settings.locale = 'en';
		if (typeof this.settings.locale === 'string') {

			// Replace with locale
			let locale = CmpDateRangePicker.Locales[this.settings.locale];
			if (!locale) {
				throw new Error('There is no DataRangePicker locale available for "' + this.settings.locale + '". You can set your custom locale by adding a key to Chicken.Dom.Component.registry.get(\'ui-date-range-picker\').Locales');
			}
			this.settings.locale = locale;

		}
		if (this.settings.format) this.settings.locale.format = this.settings.format;

		// Parse dates
		if (this.settings.minDate) this.settings.minDate = moment(this.settings.minDate);
		if (this.settings.maxDate) this.settings.maxDate = moment(this.settings.maxDate);

		///////////////////////
		// Enable datepicker //
		///////////////////////

		$el.daterangepicker(this.settings, (startDate, endDate, label) => {

			// Apply to component again.
			this.set('startDate', startDate);
			this.set('endDate', endDate);

		});
		this.picker = $el.data('daterangepicker');


		///////////
		// Icons //
		///////////

		this.$element.on('showCalendar.daterangepicker', () => {

			// Replace FA icons
			let $el = this.picker.container;
			$el.find('i.fa').each((index, icon) => {
				icon.className = icon.className.replace(/^fa fa-([\w\-]+) glyphicon glyphicon-[\w\-]+$/, '$1 icon');
				icon.className = icon.className.split(/-/).join(' ');				
			});

		});



		// Set intial value?
		if (!this.settings.startDate) {
			this.$element.val('');				
		}

	});

});

CmpDateRangePicker.Locales = {

	en: {
		format: 'LL',
		separator: ' - ',
		applyLabel: 'Apply',
		cancelLabel: 'Cancel',
		fromLabel: 'From',
		toLabel: 'To',
		customRangeLabel: 'Custom',
		weekLabel: 'W',
		daysOfWeek: [
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa'
		],
		monthNames: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		],
		firstDay: 1
	}
};



let getOptions = (defaultValues, component) => {

	// Loop through keys and check if user has set them as attribute
	let values = $.extend(defaultValues, {});

	_.each(values, (value, key) => {

		// Is there a value?
		let compValue = component.attributes[key];
		if (compValue !== undefined) {

			// Is it a reference?
			if (typeof compValue.getValue === 'function') {
				compValue = compValue.getValue();
			}

			values[key] = compValue;
		}

	});
	return values;

};

