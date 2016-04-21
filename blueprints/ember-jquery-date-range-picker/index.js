/*jshint node:true*/
module.exports = {
	normalizeEntityName: function() {},

	afterInstall: function()
	{
		return this.addBowerPackageToProject('git@github.com:sstephens/jquery-date-range-picker.git', '1.0.5');
	}
};
