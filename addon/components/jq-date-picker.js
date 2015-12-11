import Ember from 'ember';
import layout from '../templates/components/jq-date-picker';

export default Ember.Component.extend(
{
	classNames: ['js-date-picker'],

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
		var startTime = null;
		if(typeof start === 'number')
		{
			startTime = window.moment.utc(start*1000).format(this.get('format'));
		}
		
		var endTime = null;
		if(typeof end === 'number')
		{
			endTime = window.moment.utc(end*1000).format(this.get('format'));
		}

		if(!Ember.isNone(startTime) && !Ember.isNone(endTime))
		{
			el.data('dateRangePicker').setDateRange(startTime, endTime);
		}
		else if(!Ember.isNone(startTime))
		{
			el.data('dateRangePicker').setDate(startTime);
		}
	},

	dateChanged: function(evt, obj)
	{
		var time1, time2;
		if(obj.date1 !== undefined)
		{
			time1 = window.moment.utc(obj.date1.valueOf()).unix();
			this.set('startDate', time1);
		}

		if(obj.date2 !== undefined)
		{
			time2 = window.moment.utc(obj.date2.valueOf()).endOf('day').unix();
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
			if(!this.get('showButton'))
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
