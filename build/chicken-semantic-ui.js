'use strict';

/** START TEMPLATES **/
Chicken.Dom.View.TemplateCache.set('semantic-ui:modules.dropdown', '<input type="hidden">\n{{yield}}');
Chicken.Dom.View.TemplateCache.set('semantic-ui:chicken.model-form', '{{yield}}\n\n{{#if error}}\n\t<div class="ui negative icon message">\n\t\t<i class="warning icon"></i>\n\t\t<div class="content">\n\t\t\t{{error}}\t\t\t\n\t\t</div>\t\t\n\t</div>\n{{/if}}\n');
/** END TEMPLATES **/
'use strict';

/**
 * This component uses the following package:
 *	http://www.daterangepicker.com/
 */

var Component = Chicken.component('ui-date-range-picker', false, function () {
	var _this = this;

	this.tagName = 'input';

	this.on('added', function ($el) {

		// Options
		_this.settings = getOptions({

			format: undefined, // (string) Date format as accepted by Moment

			// Daterangepicker settings
			startDate: undefined, // (Date object, moment object or string) The start of the initially selected date range
			endDate: undefined, // (Date object, moment object or string) The end of the initially selected date range
			minDate: undefined, // (Date object, moment object or string) The earliest date a user may select
			maxDate: undefined, // (Date object, moment object or string) The latest date a user may select
			dateLimit: undefined, // (object) The maximum span between the selected start and end dates. Can have any property you can add to a moment object (i.e. days, months)
			showDropdowns: undefined, // (boolean) Show year and month select boxes above calendars to jump to a specific month and year
			showWeekNumbers: undefined, // (boolean) Show localized week numbers at the start of each week on the calendars
			showISOWeekNumbers: undefined, // (boolean) Show ISO week numbers at the start of each week on the calendars
			timePicker: undefined, // (boolean) Allow selection of dates with times, not just dates
			timePickerIncrement: undefined, // (number) Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30)
			timePicker24Hour: undefined, // (boolean) Use 24-hour instead of 12-hour times, removing the AM/PM selection
			timePickerSeconds: undefined, // (boolean) Show seconds in the timePicker
			ranges: undefined, // (object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range
			showCustomRangeLabel: undefined, // (boolean) Displays an item labeled "Custom Range" at the end of the list of predefined ranges, when the ranges option is used. This option will be highlighted whenever the current date range selection does not match one of the predefined ranges. Clicking it will display the calendars to select a new range.
			alwaysShowCalendars: undefined, // (boolean) Normally, if you use the ranges option to specify pre-defined date ranges, calendars for choosing a custom date range are not shown until the user clicks "Custom Range". When this option is set to true, the calendars for choosing a custom date range are always shown instead.
			opens: undefined, // (string: 'left'/'right'/'center') Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to
			drops: undefined, // (string: 'down' or 'up') Whether the picker appears below (default) or above the HTML element it's attached to
			buttonClasses: 'small button', // (array) CSS class names that will be added to all buttons in the picker
			applyClass: undefined, // (string) CSS class string that will be added to the apply button
			cancelClass: undefined, // (string) CSS class string that will be added to the cancel button
			locale: undefined, // (object) Allows you to provide localized strings for buttons and labels, customize the date format, and change the first day of week for the calendars. Check off "locale (with example settings)" in the configuration generator to see how to customize these options.
			singleDatePicker: undefined, // (boolean) Show only a single calendar to choose one date, instead of a range picker with two calendars; the start and end dates provided to your callback will be the same single date chosen
			autoApply: undefined, // (boolean) Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates or a predefined range is selected
			linkedCalendars: undefined, // (boolean) When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), and both will be advanced when clicking the left or right arrows above the calendars. When disabled, the two calendars can be individually advanced and display any month/year.
			isInvalidDate: undefined, // (function) A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.
			isCustomDate: undefined, // (function) A function that is passed each date in the two calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell.
			autoUpdateInput: true, // (boolean) Indicates whether the date range picker should automatically update the value of an <input> element it's attached to at initialization and when the selected dates change.
			parentEl: undefined // (string) jQuery selector of the parent element that the date range picker will be added to, if not provided this will be 'body'

		}, _this);

		// Locale just a language string?
		if (!_this.settings.locale) _this.settings.locale = $('html').attr('lang');
		if (!_this.settings.locale) _this.settings.locale = 'en';
		if (typeof _this.settings.locale === 'string') {

			// Replace with locale
			var locale = Component.Locales[_this.settings.locale];
			if (!locale) {
				throw new Error('There is no DataRangePicker locale available for "' + _this.settings.locale + '". You can set your custom locale by adding a key to Chicken.Dom.Component.registry.get(\'ui-date-range-picker\').Locales');
			}
			_this.settings.locale = locale;
		}
		if (_this.settings.format) _this.settings.locale.format = _this.settings.format;

		///////////////////////
		// Enable datepicker //
		///////////////////////

		$el.daterangepicker(_this.settings, function (startDate, endDate, label) {

			// Apply to component again.
			_this.set('startDate', startDate);
			_this.set('endDate', endDate);
		});
		_this.picker = $el.data('daterangepicker');

		///////////
		// Icons //
		///////////

		_this.$element.on('showCalendar.daterangepicker', function () {

			// Replace FA icons
			var $el = _this.picker.container;
			$el.find('i.fa').each(function (index, icon) {
				icon.className = icon.className.replace(/^fa fa-([\w\-]+) glyphicon glyphicon-[\w\-]+$/, '$1 icon');
				icon.className = icon.className.split(/-/).join(' ');
			});
		});

		// Set intial value?
		if (!_this.settings.startDate) {
			_this.$element.val('');
		}
	});
});

Component.Locales = {

	en: {
		format: 'LL',
		separator: ' - ',
		applyLabel: 'Apply',
		cancelLabel: 'Cancel',
		fromLabel: 'From',
		toLabel: 'To',
		customRangeLabel: 'Custom',
		weekLabel: 'W',
		daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		firstDay: 1
	}
};

var getOptions = function getOptions(defaultValues, component) {

	// Loop through keys and check if user has set them as attribute
	var values = $.extend(defaultValues, {});
	_.each(values, function (value, key) {

		// Is there a value?
		var compValue = component.attributes[key];
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
'use strict';

Chicken.component('model-form', 'semantic-ui:chicken.model-form', function () {
	var _this = this;

	this.tagName = 'form';
	this.cssClass = 'ui form';

	this.when('ready', function () {

		// Get validation for model
		var formKey = _this.get('key');
		if (!formKey) formKey = 'default';
		var rules = _this.get('model').getValidationRules(formKey);
		_this.$element.form({

			on: 'blur',
			inline: true,
			fields: rules,
			focusInvalid: true,

			onSuccess: function onSuccess(event) {

				event.preventDefault();
				_this.sendAction('save');
			}

		});

		// Prevent default form submission
		_this.$element.on('submit', function (e) {
			e.preventDefault();
		});
	});

	this.action('save', function () {

		// Set to busy
		_this.set('error', false);
		_this.$element.addClass('loading');

		// Go and save it
		_this.get('model').save({

			uri: _this.get('uri')

		}).then(function (result) {

			_this.$element.removeClass('loading');
		}, function (error) {

			// Show the error
			_this.set('error', error.getMessage());

			// No longer loading
			_this.$element.removeClass('loading');
		});
	});
});
'use strict';

Chicken.component('ui-button', false, function () {
	var _this = this;

	this.tagName = 'button';
	this.cssClass = 'ui button';

	this.dom.on('click', function () {

		_this.sendAction();
	});
});
'use strict';

Chicken.component('ui-accordion', false, function () {

	this.tagName = 'div';
	this.cssClass = 'ui accordion';

	this.on('added', function ($el) {
		$el.accordion();
	});
});
'use strict';

Chicken.component('ui-checkbox', false, function () {

	this.tagName = 'div';
	this.cssClass = 'ui checkbox';

	this.on('added', function ($el) {

		$el.checkbox();
	});
});
'use strict';

Chicken.component('ui-dropdown', 'semantic-ui:modules.dropdown', function () {
	var _this = this;

	this.tagName = 'div';
	this.cssClass = 'ui dropdown';

	this.on('added', function ($el) {

		// Move validation data to hidden input
		_this.$hidden = _this.$element.find('input[type="hidden"]');
		var dv = _this.$element.attr('data-validate');
		if (dv) {
			_this.$element.removeAttr('data-validate');
			_this.$hidden.attr('data-validate', dv);
		}

		// Multi?
		_this.multiple = _this.$element.is('.multiple');
		_this._updating = false;

		$el.dropdown({
			onChange: function onChange(value) {

				if (_this._updating) return;

				if (!_this.attributes.valueIsArray) {

					// Apply to value
					_this.set('value', value);
				}
			},
			onAdd: function onAdd(value) {

				if (_this._updating) return;
				if (_this.attributes.valueIsArray) {
					_this.get('value').add(value);
				}
			},
			onRemove: function onRemove(value) {

				if (_this._updating) return;
				if (_this.attributes.valueIsArray) {
					_this.get('value').delete(value);
				}
			}
		});

		// Whenever the value changes
		var applyValue = function applyValue() {

			// Get value
			_this._updating = true; // To prevent feedback loop
			var value = _this.get('value');
			if (_this.attributes.valueIsArray && value && value.toArray) {
				value = value.toArray();
			}

			// Apply
			$el.dropdown('set exactly', value);
			_this._updating = false;
		};
		_this.observe('value', applyValue);
		applyValue();
	});
});
'use strict';

Chicken.component('ui-progress', false, function () {
	var _this = this;

	this.tagName = 'div';
	this.cssClass = 'ui progress';

	this.on('added', function ($el) {

		$el.progress({
			value: _this.get('value')
		});
	});

	this.observe('value', function () {

		_this.$element.progress({
			value: _this.get('value')
		});
	});
});
'use strict';

Chicken.component('ui-radio', false, function () {
	var _this = this;

	var self = this;

	this.on('added', function ($el) {

		// Enable all checkboxes
		var fieldsByValue = {};
		var $fields = _this.$element.find('.ui.checkbox').checkbox({
			onChange: function onChange() {

				// Set value
				var $checkbox = $(this);
				self.set('value', $checkbox.val());
			}
		}).each(function (index, el) {
			var $el = $(el);
			var $input = $el.find('input[type="checkbox"],input[type="radio"]');
			fieldsByValue[$input.val()] = $el;
		});

		// Watch for change in value
		var applyValue = function applyValue() {

			// Find input and set it checked
			var field = fieldsByValue[_this.get('value')];
			if (field) field.checkbox('check');
		};
		_this.observe('value', applyValue);
		applyValue();
	});
});