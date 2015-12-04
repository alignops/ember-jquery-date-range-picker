import Ember from 'ember';
import layout from '../templates/components/jq-date-picker';

export default Ember.Component.extend(
{
	layout: layout,

	rawValue: null,

	init: function()
	{
		this._super();

		console.log(this.$());
	},
});
