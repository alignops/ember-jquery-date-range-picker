/*jshint node:true*/
module.exports = {
	normalizeEntityName: function() {},

	afterInstall: function()
	{
		return this.addBowerPackageToProject('https://github.com/sstephens/jquery-date-range-picker.git', 'v1.0.5');
	}
};
