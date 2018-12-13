var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HighSchoolSchema = new Schema (
{
	name: {type: String, required: true, max: 100},
}
);

// Virtual for high school's URL
HighSchoolSchema
.virtual('url')
.get(function () {
	return '/index/highschool/' + this._id;
});

// Export model
module.exports = mongoose.model('HighSchool', HighSchoolSchema);