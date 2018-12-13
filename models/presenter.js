var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PresenterSchema = new Schema (
{
    //presentID: {type: String, required: true},
	lastName: {type: String, required: true, max: 100},
	firstName: {type: String, required: true, max: 100},
	occupation: {type: String, required: true, max: 100},
	mainPhone: {type: String, required: false, max: 10},
	mobilePhone: {type: String, required: false, max: 10},
	email: {type: String, max:100},
}
);

// Virtual for presenters full name
PresenterSchema
.virtual('name')
.get(function () {
	return this.lastName + ', ' + this.firstName;
});

// Virtual for presenters URL
PresenterSchema
.virtual('url')
.get(function () {
	return '/index/presenter/' + this._id;
});

// Export model
module.exports = mongoose.model('Presenter', PresenterSchema);