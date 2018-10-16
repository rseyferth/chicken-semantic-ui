// https://github.com/mdehoog/Semantic-UI-Calendar
Chicken.component('ui-calendar', 'semantic-ui:addons.calendar', function() {

	// Configuration
	this.cssClass = 'ui calendar';
	this.defaults({ 

		value: null,
		icon: 'calendar icon',
		placeholder: '',
		format: 'LL',

		uiType: 'datetime',     // picker type, can be 'datetime', 'date', 'time', 'month', or 'year'
		uiFirstDayOfWeek: 1,    // day for first day column (0 = Sunday)
		uiConstantHeight: true, // add rows to shorter months to keep day calendar height consistent (6 rows)
		uiToday: false,         // show a 'today/now' button at the bottom of the calendar
		uiClosable: true,       // close the popup after selecting a date/time
		uiMonthFirst: true,     // month before day when parsing/converting date from/to text
		uiTouchReadonly: true,  // set input to readonly on touch devices
		uiInline: false,        // create the calendar inline instead of inside a popup
		uiOn: null,             // when to show the popup (defaults to 'focus' for input, 'click' for others)
		uiInitialDate: null,    // date to display initially when no date is selected (null = now)
		uiStartMode: false,     // display mode to start in, can be 'year', 'month', 'day', 'hour', 'minute' (false = 'day')
		uiMinDate: null,        // minimum date/time that can be selected, dates/times before are disabled
		uiMaxDate: null,        // maximum date/time that can be selected, dates/times after are disabled
		uiAmpm: false,           // show am/pm in time mode
		uiDisableYear: false,   // disable year selection mode
		uiDisableMonth: false,  // disable month selection mode
		uiDisableMinute: false, // disable minute selection mode
		uiFormatInput: true,    // format the input text upon input blur and module creation
		uiStartCalendar: null,  // jquery object or selector for another calendar that represents the start date of a date range
		uiEndCalendar: null,    // jquery object or selector for another calendar that represents the end date of a date range
		uiMultiMonth: 1        // show multiple months when in 'day' mode

	});

	// Behaviour
	this.when('ready', () => {
		
		// Events
		let options = this.getAttributes('ui');
		options.onChange = (date) => {

			// Apply value
			let parts = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
			this.set('value', moment(parts));

		};
		
		// Localized months
		options.text = {
			months: moment.months(),
			monthsShort: moment.monthsShort(),
			days: moment.weekdaysMin()
		};

		// Moments?
		_.each(options, (value, key) => {
			if (moment.isMoment(value)) {
				options[key] = value.toDate();
			}
		});
		
		// Formatter
		options.formatter = {
			date: (date) => {
				let parts = [date.getFullYear(), date.getMonth(), date.getDate()];
				return moment.utc(parts).format(this.get('format'));
			},
			dateTime: (date) => {
				return moment(date);
			}
		};

		// Create it
		this.$el = $(this.$element);
		this.$el.calendar(options);

		// Initial value?
		if (this.get('value')) {
			this.applyValue();
		}
		this.observe('value', () => {
			this.applyValue();
		});


	});

}, {

	applyValue() {

		let v = this.get('value');
		if (!v) return;
		if (!moment.isMoment(v)) v = moment(v);
		
		let curDate = this.$el.calendar('get date');
		if (v.unix() === moment(curDate).unix()) return;

		// Apply value
		this.$el.calendar('set date', v.toDate(), true, false);

	}

});