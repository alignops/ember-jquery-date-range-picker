/*jshint node:true*/
module.exports = {
	normalizeEntityName: function() {},

	afterInstall: function() 
	{
		return this.addBowerPackageToProject('https://github.com/sstephens/jquery-date-range-picker.git', '~0.0.9');
	}
};
