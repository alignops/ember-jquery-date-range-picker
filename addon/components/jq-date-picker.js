import Ember from 'ember';
import layout from '../templates/components/jq-date-picker';
import moment from 'moment';

export default Ember.Component.extend({
	classNames: ['js-date-picker'],
	classNameBindings: ['isDateRange::single'],

	layout: layout,

	rawValue: '',

	startDate: null,
	endDate: null,

	minDate: false,
	maxDate: false,

	maxDays: null,
	minDays: null,

	format: "MM/DD/YYYY",

	showTime: true,

	titleBar: '',
	seperator: '-',

	autoClose: true,

	showTopbar: false,
	selectForward: false,
	singleDate: false,

	isOpen: false,

	showButton: false,
	buttonText: '',

	startOfWeek: 'sunday',

	beforeShowDay: null,
	allowOpen: true,

	stickyMonths: false,
	_picker: null,

	inputStyle: Ember.computed('isDateRange', function() {
		let css = 'position:absolute;visibility:hidden;height:100%;left:0;';
		if (this.get('isDateRange')) {
			css += 'width:100%;';
		} else {
			css += 'width: 275px;';
		}
		return Ember.String.htmlSafe(css);
	}),

	isDateRange: Ember.computed('startDate', 'endDate', function() {
		if (!Ember.isNone(this.get('startDate')) && !Ember.isNone(this.get('endDate'))) {
			this.set('showTime', false);
			return true;
		}
		return false;
	}),

	startTimeString: Ember.computed('startDate', function() {
		let time = '';
		if (!Ember.isNone(this.get('startDate'))) {
			time = moment.utc(this.get('startDate')*1000).format(this.get('format'));
		}
		return time;
	}),

	endTimeString: Ember.computed('endDate', function() {
		let time = '';
		if (!Ember.isNone(this.get('endDate'))) {
			time = moment.utc(this.get('endDate')*1000).format(this.get('format'));
		}
		return time;
	}),

	setup: Ember.on('didInsertElement', function() {
		const _pickerElement = this.$().find('input');
		this.set('_picker', _pickerElement);

		var opts = {
			format: this.get('format'),
			autoClose: this.get('autoClose'),
			singleDate: !this.get('isDateRange'),
			customTopBar: this.get('titleBar'),
			showTopbar: this.get('showTopbar'),
			selectForward: this.get('selectForward'),
			startOfWeek: this.get('startOfWeek'),
			stickyMonths: this.get('stickyMonths'),
			time: {
				enabled: this.get('showTime')
			}
		};

		if (!Ember.isNone(this.get('minDate'))) {
			opts.startDate = moment.utc(this.get('minDate')*1000).format(this.get('format'));
		}

		if (!Ember.isNone(this.get('minDays'))) {
			opts.minDays = this.get('minDays');
		}

		if (!Ember.isNone(this.get('maxDate'))) {
			opts.endDate = moment.utc(this.get('maxDate')*1000).format(this.get('format'));
		}

		if (!Ember.isNone(this.get('maxDays'))) {
			opts.maxDays = this.get('maxDays');
		}

		if (!Ember.isNone(this.get('beforeShowDay'))) {
			Ember.assert('beforeShowDay must be a function that returns an array [isSelectable, className, option tooltip]', typeof this.get('beforeShowDay') === 'function');

			const _this = this;
			opts.beforeShowDay = function() {
				return _this.get('beforeShowDay').apply(_this.get('targetObject'), arguments);
			};
		}

		_pickerElement.dateRangePicker(opts)
		.bind('datepicker-first-date-selected', (event, obj) => {
			if (this.get('singleDate') && this.get('isDateRange')) {
				this.dateChanged(event, obj);
			}
		})
		.bind('datepicker-change', (event, obj) => {
			if (!this.get('singleDate') || !this.get('isDateRange')) {
				this.dateChanged(event, obj);
			}
		})
		.bind('datepicker-closed', () => {
			if (!this.get('isDestroyed')) {
				this.set('isOpen', false);
			}
		})
		.bind('datepicker-opened', () => {
			if (!this.get('isDestroyed')) {
				this.set('isOpen', true);
			}
		});

		this.convertTimeToVal(_pickerElement, this.get('startDate'), this.get('endDate'));
	}),

	convertTimeToVal(el, start, end) {
		let startTime = '';
		if (typeof start === 'number') {
			startTime = moment.utc(start*1000).format(this.get('format'));
		}

		let endTime = '';
		if (typeof end === 'number') {
			endTime = moment.utc(end*1000).format(this.get('format'));
		} else {
			endTime = startTime;
		}

		el.data('dateRangePicker').setDateRange(startTime, endTime);
	},

	timezone(timestamp) {
		if (timestamp !== undefined) {
			return moment(timestamp*1000).add(moment(timestamp*1000).utcOffset(), 'minutes').utcOffset()*60;
		} else {
			return moment().add(moment().utcOffset(), 'minutes').utcOffset()*60;
		}
	},

	dateChanged(evt, obj) {
		if (!this.get('isDestroyed')) {
			let time1, time2;
			if (obj.date1 !== undefined) {
				let unixTime = obj.date1.valueOf()/1000;
				unixTime = unixTime + this.timezone(unixTime);

				time1 = moment.utc(unixTime*1000).unix();
				this.set('startDate', time1);
			}

			if (obj.date2 !== undefined) {
				let unixTime = obj.date2.valueOf()/1000;
				unixTime = unixTime + this.timezone(unixTime);

				time2 = moment.utc(unixTime*1000).endOf('day').unix();
				this.set('endDate', time2);
			}

			this.sendAction('onChange', time1, time2);
		}
	},

	teardown: Ember.on('willDestroyElement', function() {
		if (!Ember.isNone(this.get('_picker'))) {
			this.get('_picker').data('dateRangePicker').destroy();
		}
	}),

	toggle() {
		if (!Ember.isNone(this.get('_picker'))) {
			if (this.get('isOpen')) {
				this.get('_picker').data('dateRangePicker').close();
			} else {
				this.get('_picker').data('dateRangePicker').open();
			}
		}
	},

	actions: {
		containerOpenClose() {
			if (this.get('allowOpen') || !this.get('showButton')) {
				this.toggle();
			}
		},

		openClose() {
			this.toggle();
		}
	}
});
