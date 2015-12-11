import Ember from 'ember';
import layout from '../templates/components/jq-date-picker';

export default Ember.Component.extend(
{
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

	isDateRange: function()
	{
		if(!Ember.isNone(this.get('startDate')) && !Ember.isNone(this.get('endDate')))
		{
			this.set('showTime', false);
			return true;
		}
		
		return false;
	}.property('startDate', 'endDate'),

	startTimeString: function()
	{
		var time = '';
		if(!Ember.isNone(this.get('startDate')))
		{
			time = window.moment.utc(this.get('startDate')*1000).format(this.get('format'));
		}
		return time;
	}.property('startDate'),
	
	endTimeString: function()
	{
		var time = '';
		if(!Ember.isNone(this.get('endDate')))
		{
			time = window.moment.utc(this.get('endDate')*1000).format(this.get('format'));
		}

		return time;
	}.property('endDate'),
	
	setup: Ember.on('didInsertElement', function()
	{
		var _this = this;
		var _pickerElement = this.$().find('input');

		var opts = {
			format: this.get('format'),
			autoClose: this.get('autoClose'),
			singleDate: !this.get('isDateRange'),
			customTopBar: this.get('titleBar'),
			showTopbar: this.get('showTopbar'),
			selectForward: this.get('selectForward'),
			startOfWeek: this.get('startOfWeek'),
			time: {
				enabled: this.get('showTime')
			}
		};

		if(!Ember.isNone(this.get('minDate')))
		{
			opts.startDate = window.moment.utc(this.get('minDate')*1000).format(this.get('format'));
		}

		if(!Ember.isNone(this.get('minDays')))
		{
			opts.minDays = this.get('minDays');
		}
		
		if(!Ember.isNone(this.get('maxDate')))
		{
			opts.endDate = window.moment.utc(this.get('maxDate')*1000).format(this.get('format'));
		}

		if(!Ember.isNone(this.get('maxDays')))
		{
			opts.maxDays = this.get('maxDays');
		}

		if(!Ember.isNone(this.get('beforeShowDay')))
		{
			Ember.assert('beforeShowDay must be a function that returns an array [isSelectable, className, option tooltip]', typeof this.get('beforeShowDay') === 'function');

			opts.beforeShowDay = function()
			{
				return _this.get('beforeShowDay').apply(_this.get('targetObject'), arguments);
			};
		}

		_pickerElement.dateRangePicker(opts)
			.bind('datepicker-first-date-selected', function(event, obj)
			{
				if(_this.get('singleDate'))
				{
					_this.dateChanged(event, obj);
				}
			})
			.bind('datepicker-change', function(event, obj)
			{
				if(!_this.get('singleDate'))
				{
					_this.dateChanged(event, obj);
				}
			})
			.bind('datepicker-closed', function()
			{
				_this.set('isOpen', false);
			})
			.bind('datepicker-opened', function()
			{
				_this.set('isOpen', true);
			});

		this.convertTimeToVal(_pickerElement, this.get('startDate'), this.get('endDate'));
	}),

	convertTimeToVal: function(el, start, end)
	{
		var startTime = '';
		if(typeof start === 'number')
		{
			startTime = window.moment.utc(start*1000).format(this.get('format'));
		}
		
		var endTime = '';
		if(typeof end === 'number')
		{
			endTime = window.moment.utc(end*1000).format(this.get('format'));
		}
		else
		{
			endTime = startTime;
		}

		el.data('dateRangePicker').setDateRange(startTime, endTime);
	},
	
	timezone: function(timestamp)
	{
		if(timestamp !== undefined)
		{
			return window.moment(timestamp*1000).add(window.moment(timestamp*1000).utcOffset(), 'minutes').utcOffset()*60;
		}
		else
		{
			return window.moment().add(window.moment().utcOffset(), 'minutes').utcOffset()*60;
		}
	},

	dateChanged: function(evt, obj)
	{
		var time1, time2;
		if(obj.date1 !== undefined)
		{
			let unixTime = obj.date1.valueOf()/1000;
				unixTime = unixTime + this.timezone(unixTime);

			time1 = window.moment.utc(unixTime*1000).unix();
			this.set('startDate', time1);
		}

		if(obj.date2 !== undefined)
		{
			let unixTime = obj.date2.valueOf()/1000;
				unixTime = unixTime + this.timezone(unixTime);

			time2 = window.moment.utc(unixTime*1000).endOf('day').unix();
			this.set('endDate', time2);
		}


		this.sendAction('onChange', time1, time2);
	},

	teardown: Ember.on('willDestroyElement', function()
	{
		this.$().find('input').data('dateRangePicker').destroy();
	}),

	toggle: function()
	{
		if(this.get('isOpen'))
		{
			this.$().find('input').data('dateRangePicker').close();
		}
		else
		{
			this.$().find('input').data('dateRangePicker').open();
		}
	},

	actions: {

		containerOpenClose: function()
		{
			if(this.get('allowOpen') || !this.get('showButton'))
			{
				this.toggle();
			}
		},

		openClose: function()
		{
			this.toggle();
		},
	}
});
