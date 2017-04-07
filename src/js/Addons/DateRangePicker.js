/**
 * This component uses the following package: http://www.daterangepicker.com/
 */
let DateRangePickerComponent = Chicken.component('ui-date-range-picker', false, function() {

	///////////////////
	// Configuration //
	///////////////////

	this.tagName = 'input';

	this.defaults({

		startDate: undefined,								// (Date object, moment object or string) The start of the initially selected date range
		endDate: undefined,									// (Date object, moment object or string) The end of the initially selected date range

		//////////////////////////////
		// Daterangepicker settings //
		//////////////////////////////

		uiFormat: undefined,								// (string) Date format as accepted by Moment
		uiMinDate: undefined,								// (Date object, moment object or string) The earliest date a user may select
		uiMaxDate: undefined,								// (Date object, moment object or string) The latest date a user may select
		uiDateLimit: undefined,								// (object) The maximum span between the selected start and end dates. Can have any property you can add to a moment object (i.e. days, months)
		uiShowDropdowns: undefined,							// (boolean) Show year and month select boxes above calendars to jump to a specific month and year
		uiShowWeekNumbers: undefined,						// (boolean) Show localized week numbers at the start of each week on the calendars
		uiShowISOWeekNumbers: undefined,					// (boolean) Show ISO week numbers at the start of each week on the calendars
		uiTimePicker: undefined,							// (boolean) Allow selection of dates with times, not just dates
		uiTimePickerIncrement: undefined,					// (number) Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30)
		uiTimePicker24Hour: undefined,						// (boolean) Use 24-hour instead of 12-hour times, removing the AM/PM selection
		uiTimePickerSeconds: undefined,						// (boolean) Show seconds in the timePicker
		uiRanges: undefined,								// (object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range
		uiShowCustomRangeLabel: undefined,					// (boolean) Displays an item labeled "Custom Range" at the end of the list of predefined ranges, when the ranges option is used. This option will be highlighted whenever the current date range selection does not match one of the predefined ranges. Clicking it will display the calendars to select a new range.
		uiAlwaysShowCalendars: undefined,					// (boolean) Normally, if you use the ranges option to specify pre-defined date ranges, calendars for choosing a custom date range are not shown until the user clicks "Custom Range". When this option is set to true, the calendars for choosing a custom date range are always shown instead.
		uiOpens: undefined,									// (string: 'left'/'right'/'center') Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to
		uiDrops: undefined,									// (string: 'down' or 'up') Whether the picker appears below (default) or above the HTML element it's attached to
		uiButtonClasses: 'small button',					// (array) CSS class names that will be added to all buttons in the picker
		uiApplyClass: undefined,							// (string) CSS class string that will be added to the apply button
		uiCancelClass: undefined,							// (string) CSS class string that will be added to the cancel button
		uiLocale: undefined,								// (object) Allows you to provide localized strings for buttons and labels, customize the date format, and change the first day of week for the calendars. Check off "locale (with example settings)" in the configuration generator to see how to customize these options.
		uiSingleDatePicker: undefined,						// (boolean) Show only a single calendar to choose one date, instead of a range picker with two calendars; the start and end dates provided to your callback will be the same single date chosen
		uiAutoApply: undefined,								// (boolean) Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates or a predefined range is selected
		uiLinkedCalendars: undefined,						// (boolean) When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), and both will be advanced when clicking the left or right arrows above the calendars. When disabled, the two calendars can be individually advanced and display any month/year.
		uiIsInvalidDate: undefined,							// (function) A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.
		uiIsCustomDate: undefined,							// (function) A function that is passed each date in the two calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell.
		uiAutoUpdateInput: true,							// (boolean) Indicates whether the date range picker should automatically update the value of an <input> element it's attached to at initialization and when the selected dates change.
		uiParentEl: undefined	

	});


	///////////////
	// Behaviour //
	///////////////

	this.when('ready', ($el) => {

		// Options
		this.settings = this.getAttributes('ui');

		// Locale just a language string?
		if (!this.settings.locale) this.settings.locale = $('html').attr('lang');
		if (!this.settings.locale) this.settings.locale = 'en';
		if (typeof this.settings.locale === 'string') {

			// Replace with locale
			let locale = DateRangePickerComponent.Locales[this.settings.locale];
			if (!locale) {
				throw new Error('There is no DataRangePicker locale available for "' + this.settings.locale + '". You can set your custom locale by adding a key to Chicken.Dom.Component.registry.get(\'ui-date-range-picker\').Locales');
			}
			this.settings.locale = locale;

		}
		if (this.settings.format) this.settings.locale.format = this.settings.format;


		//////////////////
		// Get value(s) //
		//////////////////

		if (this.get('startDate')) {
			this.settings.startDate = moment(this.get('startDate'));
			this.observe('startDate', () => {
				this.picker.setStartDate(this.get('startDate'));
				if (this.get('uiSingleDatePicker')) {
					this.picker.setEndDate(this.get('startDate'));
				}
			});
		}
		if (this.get('endDate')) {
			this.settings.endDate = moment(this.get('endDate'));
			this.observe('endDate', () => {
				this.picker.setEndDate(this.get('endDate'));				
			});
		}

		///////////////////////
		// Enable datepicker //
		///////////////////////

		this.$element.daterangepicker(this.settings, (startDate, endDate, label) => {

			// Apply to component again.
			this.set('startDate', startDate);
			this.set('endDate', endDate);

		});
		this.picker = this.$element.data('daterangepicker');
		

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

DateRangePickerComponent.Locales = {

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
