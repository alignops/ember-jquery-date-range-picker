/*jshint node:true*/
module.exports = {
	normalizeEntityName: function() {},

	afterInstall: function()
	{
		return this.addBowerPackageToProject('jquery-date-picker', '1.1.1');
	}
};
