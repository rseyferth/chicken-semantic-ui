'use strict';

/** START TEMPLATES **/
Chicken.Dom.View.TemplateCache.set('semantic-ui:addons.calendar', '<div class="ui input left icon">\n\t{{#if icon}}\n\t\t<i class={{icon}}></i>\t\n\t{{/if}}\n\t<input type="text" placeholder={{placeholder}} readonly="readonly" data-validation={{dataValidation}}>\n</div>');
Chicken.Dom.View.TemplateCache.set('semantic-ui:addons.dropzone', '\n{{#if files}}\n\n\t<div class="ui cards">\n\t{{#each files as |file|}}\n\t\t<div class="card">\n\t\t\t{{#if file.thumbnailBase64}}\n\t\t\t\t<div class="image">\n\t\t\t\t\t<img src={{file.thumbnailBase64}}>\n\t\t\t\t</div>\n\t\t\t{{/if}}\n\t\t\t<div class="content">\n\t\t\t\n\t\t\t\t{{#unless file.complete}}\t\n\t\t\t\t\t<ui-progress value={{file.progress}} error={{file.errorMessage}}>\n\t\t\t\t\t\t<div class="bar">\n\t\t\t\t\t\t\t<div class="progress"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</ui-progress>\n\t\t\t\t{{/unless}}\n\t\t\t\t{{#if file.errorMessage}}\n\t\t\t\t\t<div class="ui error message">\n\t\t\t\t\t\t{{file.errorMessage}}\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t{{/if}}\n\t\t\t</div>\n\t\t\t{{#if file.complete}}\n\t\t\t<div class="ui bottom attached button" {{action "deleteFile" file}}>\n\t\t\t\t<i class="trash icon"></i>\n\t\t\t\t{{options.dictRemoveFile}}\n\t\t\t</div>\n\t\t\t{{/if}}\n\t\t</div>\n\t{{/each}}\n\t</div>\n\n{{else}}\n\t\n\t<i class="upload icon dz-message"></i>\n\n{{/if}}');
Chicken.Dom.View.TemplateCache.set('semantic-ui:chicken.model-form', '{{yield}}\n\n{{#if error}}\n\t<div class="ui negative icon message">\n\t\t<i class="warning icon"></i>\n\t\t<div class="content">\n\t\t\t{{error}}\t\t\t\n\t\t</div>\t\t\n\t</div>\n{{/if}}\n');
Chicken.Dom.View.TemplateCache.set('semantic-ui:modules.dropdown', '<input type="hidden">\n{{yield}}\n{{#if dropdownRecords}}\n\t<div class="menu">\n\t\t{{#each dropdownRecords as |record|}}\n\t\t<div class="item" data-value={{get record valueAttribute}}>{{get record textAttribute}}</div>\n\t\t{{/each}}\n\t</div>\n{{/if}}');
Chicken.Dom.View.TemplateCache.set('semantic-ui:modules.tabs', '{{#if showMenu}}\n\t<div class={{menuClass}}>\n\t\t{{#each tabs as |tab|}}\n\t\t\t<a class="item {{if tab.active "active" ""}}" data-tab={{tab.id}}>{{tab.title}}</a>\n\t\t{{/each}}\n\t</div>\n{{/if}}\n\n{{yield}}');
/** END TEMPLATES **/
'use strict';

// https://github.com/mdehoog/Semantic-UI-Calendar
Chicken.component('ui-calendar', 'semantic-ui:addons.calendar', function () {
	var _this = this;

	// Configuration
	this.cssClass = 'ui calendar';
	this.defaults({

		value: null,
		icon: 'calendar icon',
		placeholder: '',
		format: 'LL',

		uiType: 'datetime', // picker type, can be 'datetime', 'date', 'time', 'month', or 'year'
		uiFirstDayOfWeek: 1, // day for first day column (0 = Sunday)
		uiConstantHeight: true, // add rows to shorter months to keep day calendar height consistent (6 rows)
		uiToday: false, // show a 'today/now' button at the bottom of the calendar
		uiClosable: true, // close the popup after selecting a date/time
		uiMonthFirst: true, // month before day when parsing/converting date from/to text
		uiTouchReadonly: true, // set input to readonly on touch devices
		uiInline: false, // create the calendar inline instead of inside a popup
		uiOn: null, // when to show the popup (defaults to 'focus' for input, 'click' for others)
		uiInitialDate: null, // date to display initially when no date is selected (null = now)
		uiStartMode: false, // display mode to start in, can be 'year', 'month', 'day', 'hour', 'minute' (false = 'day')
		uiMinDate: null, // minimum date/time that can be selected, dates/times before are disabled
		uiMaxDate: null, // maximum date/time that can be selected, dates/times after are disabled
		uiAmpm: false, // show am/pm in time mode
		uiDisableYear: false, // disable year selection mode
		uiDisableMonth: false, // disable month selection mode
		uiDisableMinute: false, // disable minute selection mode
		uiFormatInput: true, // format the input text upon input blur and module creation
		uiStartCalendar: null, // jquery object or selector for another calendar that represents the start date of a date range
		uiEndCalendar: null, // jquery object or selector for another calendar that represents the end date of a date range
		uiMultiMonth: 1 // show multiple months when in 'day' mode

	});

	// Behaviour
	this.when('ready', function () {

		// Events
		var options = _this.getAttributes('ui');
		options.onChange = function (date) {

			// Apply value
			var parts = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
			_this.set('value', moment(parts));
		};

		// Localized months
		options.text = {
			months: moment.months(),
			monthsShort: moment.monthsShort(),
			days: moment.weekdaysMin()
		};

		// Moments?
		_.each(options, function (value, key) {
			if (moment.isMoment(value)) {
				options[key] = value.toDate();
			}
		});

		// Formatter
		options.formatter = {
			date: function date(_date) {
				var parts = [_date.getFullYear(), _date.getMonth(), _date.getDate()];
				return moment.utc(parts).format(_this.get('format'));
			},
			dateTime: function dateTime(date) {
				return moment(date);
			}
		};

		// Create it
		_this.$el = $(_this.$element);
		_this.$el.calendar(options);

		// Initial value?
		if (_this.get('value')) {
			_this.applyValue();
		}
		_this.observe('value', function () {
			_this.applyValue();
		});
	});
}, {
	applyValue: function applyValue() {

		var v = this.get('value');
		if (!v) return;
		if (!moment.isMoment(v)) v = moment(v);

		var curDate = this.$el.calendar('get date');
		if (v.unix() === moment(curDate).unix()) return;

		// Apply value
		this.$el.calendar('set date', v.toDate(), true, false);
	}
});
'use strict';

/**
 * This component uses the following package: http://www.daterangepicker.com/
 */
var DateRangePickerComponent = Chicken.component('ui-date-range-picker', false, function () {
	var _this = this;

	///////////////////
	// Configuration //
	///////////////////

	this.tagName = 'input';

	this.defaults({

		startDate: undefined, // (Date object, moment object or string) The start of the initially selected date range
		endDate: undefined, // (Date object, moment object or string) The end of the initially selected date range

		//////////////////////////////
		// Daterangepicker settings //
		//////////////////////////////

		uiFormat: undefined, // (string) Date format as accepted by Moment
		uiMinDate: undefined, // (Date object, moment object or string) The earliest date a user may select
		uiMaxDate: undefined, // (Date object, moment object or string) The latest date a user may select
		uiDateLimit: undefined, // (object) The maximum span between the selected start and end dates. Can have any property you can add to a moment object (i.e. days, months)
		uiShowDropdowns: undefined, // (boolean) Show year and month select boxes above calendars to jump to a specific month and year
		uiShowWeekNumbers: undefined, // (boolean) Show localized week numbers at the start of each week on the calendars
		uiShowISOWeekNumbers: undefined, // (boolean) Show ISO week numbers at the start of each week on the calendars
		uiTimePicker: undefined, // (boolean) Allow selection of dates with times, not just dates
		uiTimePickerIncrement: undefined, // (number) Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30)
		uiTimePicker24Hour: undefined, // (boolean) Use 24-hour instead of 12-hour times, removing the AM/PM selection
		uiTimePickerSeconds: undefined, // (boolean) Show seconds in the timePicker
		uiRanges: undefined, // (object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range
		uiShowCustomRangeLabel: undefined, // (boolean) Displays an item labeled "Custom Range" at the end of the list of predefined ranges, when the ranges option is used. This option will be highlighted whenever the current date range selection does not match one of the predefined ranges. Clicking it will display the calendars to select a new range.
		uiAlwaysShowCalendars: undefined, // (boolean) Normally, if you use the ranges option to specify pre-defined date ranges, calendars for choosing a custom date range are not shown until the user clicks "Custom Range". When this option is set to true, the calendars for choosing a custom date range are always shown instead.
		uiOpens: undefined, // (string: 'left'/'right'/'center') Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to
		uiDrops: undefined, // (string: 'down' or 'up') Whether the picker appears below (default) or above the HTML element it's attached to
		uiButtonClasses: 'small button', // (array) CSS class names that will be added to all buttons in the picker
		uiApplyClass: undefined, // (string) CSS class string that will be added to the apply button
		uiCancelClass: undefined, // (string) CSS class string that will be added to the cancel button
		uiLocale: undefined, // (object) Allows you to provide localized strings for buttons and labels, customize the date format, and change the first day of week for the calendars. Check off "locale (with example settings)" in the configuration generator to see how to customize these options.
		uiSingleDatePicker: undefined, // (boolean) Show only a single calendar to choose one date, instead of a range picker with two calendars; the start and end dates provided to your callback will be the same single date chosen
		uiAutoApply: undefined, // (boolean) Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates or a predefined range is selected
		uiLinkedCalendars: undefined, // (boolean) When enabled, the two calendars displayed will always be for two sequential months (i.e. January and February), and both will be advanced when clicking the left or right arrows above the calendars. When disabled, the two calendars can be individually advanced and display any month/year.
		uiIsInvalidDate: undefined, // (function) A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.
		uiIsCustomDate: undefined, // (function) A function that is passed each date in the two calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell.
		uiAutoUpdateInput: true, // (boolean) Indicates whether the date range picker should automatically update the value of an <input> element it's attached to at initialization and when the selected dates change.
		uiParentEl: undefined

	});

	///////////////
	// Behaviour //
	///////////////

	this.when('ready', function ($el) {

		// Options
		_this.settings = _this.getAttributes('ui');

		// Locale just a language string?
		if (!_this.settings.locale) _this.settings.locale = $('html').attr('lang');
		if (!_this.settings.locale) _this.settings.locale = 'en';
		if (typeof _this.settings.locale === 'string') {

			// Replace with locale
			var locale = DateRangePickerComponent.Locales[_this.settings.locale];
			if (!locale) {
				throw new Error('There is no DataRangePicker locale available for "' + _this.settings.locale + '". You can set your custom locale by adding a key to Chicken.Dom.Component.registry.get(\'ui-date-range-picker\').Locales');
			}
			_this.settings.locale = locale;
		}
		if (_this.settings.format) _this.settings.locale.format = _this.settings.format;

		//////////////////
		// Get value(s) //
		//////////////////

		if (_this.get('startDate')) {
			_this.settings.startDate = moment(_this.get('startDate'));
			_this.observe('startDate', function () {
				_this.picker.setStartDate(_this.get('startDate'));
				if (_this.get('uiSingleDatePicker')) {
					_this.picker.setEndDate(_this.get('startDate'));
				}
			});
		}
		if (_this.get('endDate')) {
			_this.settings.endDate = moment(_this.get('endDate'));
			_this.observe('endDate', function () {
				_this.picker.setEndDate(_this.get('endDate'));
			});
		}

		///////////////////////
		// Enable datepicker //
		///////////////////////

		_this.$element.daterangepicker(_this.settings, function (startDate, endDate, label) {

			// Apply to component again.
			_this.set('startDate', startDate);
			_this.set('endDate', endDate);
		});
		_this.picker = _this.$element.data('daterangepicker');

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
		daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		firstDay: 1
	}
};
'use strict';

/**
 * This component uses the following package:
 *	http://www.dropzonejs.com/
 */
var DropzoneComponent = Chicken.component('ui-dropzone', 'semantic-ui:addons.dropzone', function () {
	var _this = this;

	///////////////////
	// Configuration //
	///////////////////

	this.cssClass = 'ui selection dropdown dropzone';
	this.defaults({

		dzMaxFilesize: 32,
		dzFilesizeBase: 1000,
		dzParamName: 'file',
		dzUploadMultiple: false,
		dzAcceptedFiles: null,

		multiple: false,

		value: false

	});

	// Stats
	this.set('files', [], true);

	//////////////////////
	// Dropzone options //
	//////////////////////

	this.options = $.extend({

		addedfile: function addedfile(file) {

			// Real file, or mock?
			var data = void 0;
			if (file instanceof File) {

				// File from browser
				data = {
					file: file,
					name: file.name,
					size: file.size,
					complete: false,
					canceled: false,
					success: false,
					errorMessage: false,
					uploading: true,
					progress: 0,
					bytesSent: 0,
					thumbnailBase64: false,
					model: null
				};
			} else {

				// File from api
				data = {
					file: file,
					name: file.name,
					size: 100000,
					complete: true,
					canceled: false,
					success: true,
					errorMessage: false,
					uploading: false,
					progress: 100,
					bytesSent: 100,
					thumbnailBase64: false,
					model: null
				};
			}

			// Create a 'model'
			var model = Chicken.observable(data);
			file.model = model;
			_this.get('files').add(model);
		},

		thumbnail: function thumbnail(file, dataUrl) {

			// Store on file
			file.model.set('thumbnailBase64', dataUrl);
		},

		uploadprogress: function uploadprogress(file, progress, bytesSent) {

			// Update 
			file.model.set('progress', progress);
			file.model.set('bytesSent', bytesSent);
		},

		error: function error(file, _error) {

			file.model.set('errorMessage', typeof _error === 'string' ? _error : _error.message);
			file.model.set('success', false);
			file.model.set('complete', true);
		},

		success: function success(file, response) {

			// Deserialize response
			try {
				response = Chicken.app.api(_this.get('api')).deserialize(response);
			} catch (error) {
				file.model.set('errorMessage', typeof error === 'string' ? error : error.message);
				file.model.set('success', false);
				file.model.set('complete', true);
				return;
			}

			// Apply
			file.model.set('success', true);
			file.model.set('complete', true);
			file.model.set('model', response);

			// Update
			updateValue();
		},

		sending: function sending(file, xhr, formData) {

			// Get ajax options from API
			var api = Chicken.app.api(_this.get('api'));
			if (api) {
				var auth = api.getAuth();
				if (auth) {
					var beforeSend = auth.getAjaxOptions().beforeSend;
					if (beforeSend) {
						beforeSend(xhr);
					}
				}
			}
		},

		reset: function reset() {}

	}, DropzoneComponent.Config, this.getAttributes('dz'));

	// Multple / single
	if (this.options.maxFiles === undefined) {
		this.options.maxFiles = this.attributes.multiple ? null : 1;
	}

	// Make available in template
	this.set('options', this.options, true);

	// When rendered
	this.when('ready', function () {

		////////////////////////
		// Make the dropzone. //
		////////////////////////

		_this.dropzone = new Dropzone(_this.$element[0], _this.options);

		// Apply existing
		_this.applyValue();
	});

	/////////////
	// Actions //
	/////////////

	this.action('deleteFile', function (file) {

		// Remove the file
		_this.get('files').delete(file);
		_this.dropzone.removeFile(file.get('file'));

		// Update
		_this.updateValue();
	});
}, {
	applyValue: function applyValue() {
		var _this2 = this;

		var files = this.get('value');
		if (typeof files === 'string') files = [files];
		if (files instanceof Array) {
			_.each(files, function (f) {

				// Add mock file
				var data = {
					name: f,
					size: 12345
				};
				var model = _this2.dropzone.emit('addedfile', data);
				_this2.dropzone.emit("thumbnail", data, _this2.options.url + '/' + f);
			});
		}
	},
	updateValue: function updateValue() {
		var _this3 = this;

		// Single?
		if (this.options.multiple) {

			// Set values
			var values = [];
			this.get('files').each(function (file) {
				if (file.get('model')) {
					values.push(file.get('model').get(_this3.options.modelValueAttribute));
				}
			});
			this.set('value', values, true);
		} else {

			// Get first
			if (this.get('files').length === 0) {
				this.set('value', null);
			} else {
				var file = this.get('files').first();

				if (file.get('model')) {
					this.set('value', file.get('model').get(this.options.modelValueAttribute));
				} else {
					this.set('value', null);
				}
			}
		}
	}
});

DropzoneComponent.ComponentCallbacks = ['accept', 'renameFilename', 'fallback', 'resize', 'init'];

// Global configuration
DropzoneComponent.Config = {

	url: '/',
	modelValueAttribute: 'path',
	thumbnailWidth: 290,
	thumbnailHeight: 290

};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SemanticApiRequest = function () {
	function SemanticApiRequest(api, uri) {
		_classCallCheck(this, SemanticApiRequest);

		this.api = api;
		this.uri = uri;

		this.auth = null;
	}

	_createClass(SemanticApiRequest, [{
		key: 'toSemantic',
		value: function toSemantic() {
			var _this = this;

			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


			// Basics
			var apiOptions = {
				url: this.api.makeUrl(this.uri)
			};

			// Check auth
			var auth = this.auth ? this.auth : this.api.getAuth();
			if (auth) {
				var ajaxOptions = auth.getAjaxOptions();
				if (ajaxOptions.beforeSend) {
					apiOptions.beforeXHR = ajaxOptions.beforeSend;
				}
			}

			// Parse response
			apiOptions.onResponse = function (response) {

				return _this._convertApiResponse(response);
			};

			// Combine
			$.extend(apiOptions, options);

			// Done
			return apiOptions;
		}
	}, {
		key: 'convertResponse',
		value: function convertResponse(callback) {
			this.convertResponseCallback = callback;
			return this;
		}
	}, {
		key: '_convertApiResponse',
		value: function _convertApiResponse(response) {

			// Fake api call
			var apiCall = new Chicken.Api.ApiCall(this.api, 'get', '/');

			// Parse it
			var data = this.api.deserialize(response, apiCall);

			// Map to semantic format
			var result = {
				success: true
			};

			// Conversion defined?
			if (this.convertResponseCallback) {

				// Convert it
				result.results = this.convertResponseCallback.apply(this, [data]);
			} else {

				// Collection or model?
				if (data instanceof Chicken.Data.Model) {

					// To object
					result.results = data.toObject();
				} else {

					// To array
					result.results = data.toArray();
				}
			}

			return result;
		}
	}]);

	return SemanticApiRequest;
}();

;

module.exports = SemanticApiRequest;
'use strict';

window.ChickenSemantic = {
	applyApiErrorToForm: function applyApiErrorToForm($form, apiError) {

		// Loop errors
		var errors = _.mapObject(apiError.getFormErrors(), function (messages, field) {

			return messages.join(' ');
		});

		// This should work better in the future (new versions of Semantic)		
		//$form.form('add errors', errors);
		_.each(errors, function (message, key) {
			$form.form('add prompt', key, message);
		});
	},
	getUiOptions: function getUiOptions(component) {

		return component.getAttributes('ui');
	}
};
'use strict';

Chicken.helper('uiNumber', function (params) {

	// Get value
	var nr = parseInt(Chicken.getValue(params[0]));
	return window.numbers[nr];
});
'use strict';

Chicken.component('model-form', 'semantic-ui:chicken.model-form', function () {
	var _this = this;

	this.tagName = 'form';
	this.cssClass = 'ui form';

	this.defaults({

		onSaved: false

	});

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

			showLoadingIndicator: true,
			showLoadingIndicatorAfterSuccess: false,

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
		if (_this.get('showLoadingIndicator')) _this.$element.addClass('loading');

		// Clear errors
		_this.$element.find('.error').removeClass('error').find('.prompt').remove();

		// Go and save it
		_this.get('model').save({

			uri: _this.get('uri')

		}).then(function (result) {

			if (!_this.get('showLoadingIndicatorAfterSuccess')) _this.$element.removeClass('loading');

			if (_this.get('onSaved')) _this.sendAction(_this.get('onSaved'), [result]);
		}, function (error) {

			// Check errors
			window.ChickenSemantic.applyApiErrorToForm(_this.$element, error);

			// Show the error
			_this.set('error', error.getMessage());

			// No longer loading
			_this.$element.removeClass('loading');
		});
	});
});
'use strict';

Chicken.component('ui-menu', false, function () {
	var _this = this;

	///////////////////
	// Configuration //
	///////////////////

	this.defaults({

		value: false

	});

	///////////////
	// Behaviour //
	///////////////

	this.when('ready', function () {

		// Index items
		_this.indexItems();

		// Selection!
		_this.observe('value', function () {

			// Apply selected
			_this.applyValue();
		});
		_this.applyValue();
	});
}, {

	////////////////////
	// Public methods //
	////////////////////

	indexItems: function indexItems() {
		var _this2 = this;

		// Find items
		this.items = [];
		this.$items = $(this.$element).find('.item').each(function (index, el) {

			// Add it
			var $el = $(el);
			_this2.items.push({
				$element: $el,
				value: _this2._getValue($el)
			});
		});

		// Click event
		this.$items.on('click', function (e) {
			e.preventDefault();

			// Get value
			_this2.set('value', _this2._getValue($(e.target)));
		});
	},
	applyValue: function applyValue() {
		var _this3 = this;

		// Toggle item activeness
		_.each(this.items, function (item) {

			item.$element.toggleClass('active', item.value === _this3.get('value'));
		});
	},
	_getValue: function _getValue($el) {
		return $el.data('value') || $el.text();
	}
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

Chicken.component('ui-input', false, function () {
	var _this = this;

	this.tagName = 'input';

	this.on('added', function () {

		////////////////////////////////
		// Whenever the value changes //
		////////////////////////////////

		_this._updating = false;
		_this.$element.on('change blur', function () {

			// Not updating...
			if (_this._updating) return;

			// Set it
			_this.set('value', _this.$element.val());
		});

		var applyValue = function applyValue() {

			// Get value
			_this._updating = true; // To prevent feedback loop
			_this.$element.val(_this.get('value'));
			_this._updating = false;
		};
		_this.observe('value', applyValue);
		applyValue();
	});
});
'use strict';

Chicken.component('ui-textarea', false, function () {
	var _this = this;

	this.tagName = 'textarea';

	this.on('added', function () {

		////////////////////////////////
		// Whenever the value changes //
		////////////////////////////////

		_this._hasFocus = false;
		_this.$element.on('focus', function () {
			_this._hasFocus = true;
		});
		_this.$element.on('blur', function () {
			_this._hasFocus = false;
		});

		_this.$element.on('change keyup paste', function () {

			// Set it
			var text = _this.$element.val();
			if (_this.get('value') !== text) {
				_this.set('value', text);
			}
		});

		var applyValue = function applyValue() {

			// Get value
			var text = _this.get('value');
			if (_this.$element.val() !== text && !_this._hasFocus) {
				_this.$element.val(_this.get('value'));
			}
		};
		_this.observe('value', applyValue);
		applyValue();
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

	// Initialize the checked value
	if (!this.get('checked')) this.set('checked', false);
});
'use strict';

Chicken.component('ui-dropdown', 'semantic-ui:modules.dropdown', function () {
	var _this = this;

	///////////////////
	// Configuration //
	///////////////////

	this.tagName = 'div';
	this.cssClass = 'ui dropdown';

	this.defaults({

		nameAttribute: 'name',
		valueAttribute: 'value',
		textAttribute: 'name',

		useModelAsValue: false,
		additionModel: false,

		source: false,

		onSelect: false,
		clearAfterSelection: false,

		// Semantic options
		uiOn: 'click',
		uiAllowReselection: false,
		uiAllowAdditions: false,
		uiHideAdditions: true,
		//uiAction: auto,
		uiMinCharacters: 1,
		uiMatch: 'both',
		uiSelectOnKeyDown: true,
		uiForceSelection: false,
		uiAllowCategorySelection: false
		//uiPlaceholder: auto

	});

	//////////
	// Data //
	//////////

	this.modelMap = {};
	this.beforeRender(function () {

		// Collection given?
		if (_this.get('source') instanceof Chicken.Data.Collection) {

			// Set source
			var updateSource = function updateSource() {

				// Render it in the view
				_this.set('dropdownRecords', _this.get('source'));
				_this.set('useDropdownRecords', true);

				// Create model map
				if (_this.get('useModelAsValue')) {
					_this.modelMap = {};
					_this.get('source').each(function (model) {
						_this.modelMap[model.get(_this.get('valueAttribute'))] = model;
					});
				}
			};
			updateSource();
		}
	});

	///////////////
	// Behaviour //
	///////////////

	this.on('added', function ($el) {

		// Create options
		var options = _this.getAttributes('ui');

		// Move validation data to hidden input
		_this.$hidden = _this.$element.find('input[type="hidden"]');
		var dv = _this.$element.attr('data-validate');
		if (dv) {
			_this.$element.removeAttr('data-validate');
			_this.$hidden.attr('data-validate', dv);
		}
		var name = _this.$element.attr('name');
		if (name) {
			_this.$hidden.attr('name', name);
		}

		// Multi?
		_this.multiple = _this.$element.is('.multiple');

		////////////
		// Events //
		////////////

		options.onChange = function (value, text, $addedChoice) {

			// Same as last?
			if (_this._updating) return;
			if (value === _this.get('value')) return;

			// Selected?
			if (_this.get('onSelect')) {

				// Send the action
				_this.sendAction(_this.get('onSelect'), [value, text]);
			}

			// Clear?
			if (_this.get('clearAfterSelection')) {
				_this.set('value', null);
				return;
			}

			if (!_this.get('valueIsArray') && $addedChoice) {

				// Use model?
				if (_this.get('useModelAsValue')) {

					// Custom addition?
					if ($addedChoice.is('.addition')) {

						// Create new model instance!
						var modelClass = _this.get('additionModel');
						if (modelClass) {
							modelClass = Chicken.model(modelClass);
						} else {
							modelClass = Chicken.Data.Model;
						}

						// Create it
						var model = new modelClass();
						model.set(_this.get('nameAttribute'), text);
						value = model;
					} else {

						// Look it up
						value = _this.modelMap[value];
					}
				}

				// Apply to value
				_this.set('value', value);
			}
		};
		options.onAdd = function (value) {

			if (_this.get('valueIsArray')) {

				// Initialized array?
				if (!_this.get('value')) {

					// Create observable array
					_this.set('value', [], true);
				} else if (!(_this.get('value') instanceof Chicken.Core.ObservableArray)) {

					// Make it into an observable array
					_this.set('value', new Chicken.Core.ObservableArray(_this.get('value')));
				}

				// Already in there?
				if (_this.get('value').find(function (v) {
					return v === value;
				})) return;

				// Add the new value
				_this.get('value').add(value);
			}
		};
		options.onRemove = function (value) {

			if (_this.attributes.valueIsArray) {
				_this.get('value').delete(value);
			}
		};

		///////////////////
		// Source given? //
		///////////////////

		if (_this.get('source')) {

			// Remote source (url)?
			if (typeof _this.get('source') === 'string') {

				// Get api
				var apiKey = _this.attributes.apiKey ? _this.attributes.apiKey : null;
				var api = Chicken.app.api(apiKey);

				// Make request
				var request = new SemanticApiRequest(api, _this.attributes.source);

				// Convert the response from the API
				options.apiSettings = request.convertResponse(function (response) {

					return response.map(function (model) {

						// Store the model itself
						if (_this.get('useModelAsValue')) {
							_this.modelMap[model.get(_this.get('valueAttribute'))] = model;
						}

						// Convert to semantic format
						return {
							name: model.get(_this.get('nameAttribute')),
							value: model.get(_this.get('valueAttribute')),
							text: model.get(_this.get('textAttribute'))
						};
					});
				}).toSemantic({

					cache: options.cache || false

				});
			}
		}

		///////////////
		// Create it //
		///////////////

		$el = $($el);
		$el.dropdown(options);

		////////////////////////////////
		// Whenever the value changes //
		////////////////////////////////

		var applyValue = function applyValue() {

			// Get value
			var value = _this.get('value');
			if (_this.attributes.valueIsArray && value && value.toArray) {
				value = value.toArray();
			}

			// Same as current?
			var oldValue = $el.dropdown('get value');
			if (_this.get('valueIsArray')) {

				// Compare arrays
				oldValue = oldValue.split(/,/);
				if (_.intersection(oldValue, value).length === oldValue.length) return;
			} else {

				// Compare textually
				if (oldValue === value) return;
			}

			// Updating
			_this._updating = true;

			// Is it a model not in the map?
			if (value instanceof Chicken.Data.Model) {

				// Get info from the model
				$el.dropdown('set text', value.get(_this.get('textAttribute')));
				$el.dropdown('set value', value.get(_this.get('valueAttribute')));
			} else {

				// Not an array?
				if (!_this.get('valueIsArray')) value = '' + value;

				// Apply
				$el.dropdown('set exactly', value);
			}

			// Done.
			_this._updating = false;
		};
		_this.observe('value', applyValue);

		// Initial value?
		applyValue();
	});
});
'use strict';

Chicken.component('ui-modal', false, function () {
	var _this = this;

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
		autoCenterSelf: true, // When I render myself, center again

		// Custom template url
		template: false

	});

	////////////////////////////
	// Inject custom template //
	////////////////////////////
	// Get source for view
	if (this.get('template')) {

		// Find it
		var cache = Chicken.Dom.View.TemplateCache;
		if (!cache.has(this.get('template'))) throw new Error('There is no View template cached with the key "' + this.get('template') + '"');
		this.templateString = cache.get(this.get('template'));
	}

	///////////////
	// Behaviour //
	///////////////

	this.when('ready', function () {

		// Auto-show?
		if (_this.get('autoShow')) {
			_this.show();
		}

		// Center?
		if (_this.get('autoCenter')) {

			// When revalidated
			var knownComponents = [];
			_this.on('revalidate', function () {

				// Check child components
				_.each(_this.components, function (comp, key) {

					// Already known?
					if (_.contains(knownComponents, key)) return;
					knownComponents.push(key);

					// Listen
					comp.on('revalidate', function () {
						_this.refreshIfSizeChanged();
					});
				});

				// Refresh it
				_this.refreshIfSizeChanged();
			});
		} else if (_this.get('autoCenterSelf')) {

			// Watch me.
			_this.on('revalidate', function () {
				_this.refreshIfSizeChanged();
			});
		}
	});
}, {
	_initialize: function _initialize() {
		var _this2 = this;

		// Already done?
		if (this.isInitialized) return;
		this.isInitialized = true;

		// Make modal
		var config = ChickenSemantic.getUiOptions(this);

		// Override default button behaviour ?
		if (this.get('overrideButtonBehaviour')) {

			config.onApprove = function () {
				return false;
			};
			config.onDeny = function () {
				return false;
			};
		} else {

			config.onApprove = function () {

				// Callback?
				if (_this2._approveCallback) {
					if (_this2._approveCallback() === false) return false;
				}

				// Done
				if (_this2._showResolve) _this2._showResolve();
			};
			config.onDeny = function () {

				// Callback?
				if (_this2._denyCallback) {
					if (_this2._denyCallback() === false) return false;
				}

				// Done
				if (_this2._showReject) _this2._showReject();
			};
			config.onHide = function () {

				// Done
				if (_this2._showReject) _this2._showReject();
			};
		}

		// Init modal
		this.$element.modal(config);
	},
	show: function show() {
		var _this3 = this;

		var approveCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var denyCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


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
		return new Promise(function (resolve, reject) {
			_this3._showResolve = resolve;
			_this3._showReject = reject;
		});
	},
	hide: function hide() {
		this.modalIsShowing = false;
		this.$element.modal('hide');
	},
	refresh: function refresh() {
		var _this4 = this;

		if (this._refreshTimeout || !this.modalIsShowing) return;

		this._refreshTimeout = setTimeout(function () {
			_this4.$element.modal('refresh');
			_this4._refreshTimeout = false;
		}, 10);
	},
	refreshIfSizeChanged: function refreshIfSizeChanged() {

		// Not showing?
		if (!this.modalIsShowing) return;

		// Check current size
		var currentSize = this.$element.width() + 'x' + this.$element.height();
		if (currentSize !== this.previousSize) {
			this.refresh();
			this.previousSize = currentSize;
		}
	},
	setLoading: function setLoading() {
		var isLoading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

		this.$element.toggleClass('loading', isLoading);
	}
});
'use strict';

Chicken.component('ui-popup', false, function () {
	var _this = this;

	///////////////////
	// Configuration //
	///////////////////

	this.tagName = 'span';
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
		uiMaxSearchDepth: 10,

		content: false

	});

	///////////////
	// Behaviour //
	///////////////

	this.when('ready', function () {

		// Activate
		var options = _this.getAttributes('ui');
		/*options.onShow = (...args) => {
  	
  };*/
		// Content set?
		if (_this.get('content')) {
			_this.$element.data('content', _this.get('content'));
		}

		_this.$element.popup(options);
	});
}, {});
'use strict';

Chicken.component('ui-progress', false, function () {
	var _this = this;

	this.tagName = 'div';
	this.cssClass = 'ui progress';

	this.defaults({

		error: '',

		uiAutoSuccess: true,
		uiShowActivity: false,
		uiLimitValues: true,
		uiLabel: 'percent',
		uiPrecision: 1,
		uiTotal: false,

		value: false

	});

	this.observe('error', function () {

		// Toggle class
		_this.$element.toggleClass('error', _this.get('error').length > 0);
	});

	this.on('added', function ($el) {

		// Create progress bar
		var attr = _this.getAttributes('ui');
		attr.value = _this.get('value');
		$el.progress(attr);
	});

	this.observe('value', function () {

		_this.$element.progress('set progress', _this.get('value'));
	});
});
'use strict';

Chicken.component('ui-radio', false, function () {
	var _this = this;

	var self = this;

	this.defaults({
		useModelAsValue: false
	});

	this.on('added', function ($el) {

		// Enable all checkboxes
		var fieldsByValue = {};
		var $fields = _this.$element.find('.ui.checkbox').checkbox({

			onChange: function onChange() {

				// Set value
				var $checkbox = $(this);
				var value = $checkbox.val();

				if (self.get('useModelAsValue') && self.get('sourceCollection') && self.get('valueAttribute')) {
					value = self.get('sourceCollection').find(self.get('valueAttribute'), $checkbox.val());
				}

				if (!value) return;

				self.set('value', value);
			}

		}).each(function (index, el) {
			var $el = $(el);
			var $input = $el.find('input[type="checkbox"],input[type="radio"]');
			fieldsByValue[$input.val()] = $el;
		});

		// Watch for change in value
		var applyValue = function applyValue() {

			var value = _this.get('value');
			if (!value) return;

			// getvalueAttribute from value if model is used
			if (_this.get('useModelAsValue') && _this.get('valueAttribute')) {
				value = _this.get('value').get(_this.get('valueAttribute'));
			}

			var field = fieldsByValue[value];
			if (field) field.checkbox('check');
		};
		_this.observe('value', applyValue);
		applyValue();
	});
});
'use strict';

Chicken.component('ui-rating', false, function () {
    var _this = this;

    //  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ ██╗   ██╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
    // ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
    // ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗██║   ██║██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║
    // ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║██║   ██║██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
    // ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
    //  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
    //                                                                                                        

    this.cssClass = 'ui rating';
    this.defaults({

        value: null,

        uiInitialRating: 0,
        uiFireOnInit: false,
        uiClearable: 'auto',
        uiInteractive: true,

        uiMaxRating: 5

    });

    // ██████╗ ███████╗██╗  ██╗ █████╗ ██╗   ██╗██╗ ██████╗ ██╗   ██╗██████╗ 
    // ██╔══██╗██╔════╝██║  ██║██╔══██╗██║   ██║██║██╔═══██╗██║   ██║██╔══██╗
    // ██████╔╝█████╗  ███████║███████║██║   ██║██║██║   ██║██║   ██║██████╔╝
    // ██╔══██╗██╔══╝  ██╔══██║██╔══██║╚██╗ ██╔╝██║██║   ██║██║   ██║██╔══██╗
    // ██████╔╝███████╗██║  ██║██║  ██║ ╚████╔╝ ██║╚██████╔╝╚██████╔╝██║  ██║
    // ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
    //                                                                       

    this.when('ready', function () {

        // Prepare options
        var options = _this.getAttributes('ui');

        // On rate
        options.onRate = function (v) {

            // Set value
            if (v !== _this.get('value')) {
                _this.set('value', v);
            }
        };

        // Create.
        _this.$element.rating(options);

        // Observe value
        _this.observe('value', function () {
            _this.applyValue();
        });
        _this.applyValue();
    });
}, {
    applyValue: function applyValue() {

        // Do we have a value?
        var newValue = this.get('value');
        if (newValue === undefined) newValue = 0;
        var oldValue = this.$element.rating('get rating');

        // Changed?
        if (oldValue === newValue) return;

        // Apply
        this.$element.rating('set rating', newValue);
    }
});
'use strict';

Chicken.component('ui-sticky', false, function () {
	var _this = this;

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

	this.when('ready', function () {

		_this.$element.sticky(_this.getAttributes('ui'));
	});
}, {});
'use strict';

Chicken.component('ui-tab', false, function () {

	///////////////////
	// Configuration //
	///////////////////

	this.cssClass = 'ui tab';
	this.defaults({

		title: 'Tab'

	});

	///////////////
	// Behaviour //
	///////////////

	this.beforeRender(function () {});
}, {});
'use strict';

Chicken.component('ui-tabs', 'semantic-ui:modules.tabs', function () {
	var _this = this;

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

	this.when('ready', function () {

		// Index tabs
		var tabs = new Chicken.Core.ObservableArray();
		var active = true;
		_.each(_this.components, function (component, id) {

			// Create info
			var info = new Chicken.Core.Observable({
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
		_this.set('tabs', tabs);

		// Go!
		_this.on('revalidate', function () {

			$(_this.$element).find('.menu .item').tab();
		});
	});
}, {});