/* jshint node: true */
'use strict';

module.exports = {
	name: 'ember-jquery-date-range-picker',

	included: function(app)
	{
		this._super.included(app);

		this.app.import(app.bowerDirectory + '/jquery-date-picker/jquery.daterangepicker.js');
		this.app.import(app.bowerDirectory + '/jquery-date-picker/daterangepicker.css');
	}
};
