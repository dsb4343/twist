var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ParticipantSchema = new Schema (
{
	lastName: {type: String, required: true, max: 100},
	firstName: {type: String, required: true, max: 100},
	address: {type: String, required: true, max: 100},
	email: {type: String, required: true, max: 100},
	highSchool: {type: Schema.Types.ObjectId, ref: 'HighSchool', required: true},
	timeStamp: {type: Date, default: Date.now},
	participantType: {type: String},
    //interest:{}, needs added
    //session: needs added
}
);

// Virtual for participant's full name
ParticipantSchema
.virtual('name')
.get(function () {
	return this.lastName + ', ' + this.firstName;
});

// Virtual for participant's URL
ParticipantSchema
.virtual('url')
.get(function () {
	return '/index/participant/' + this._id;
});

// Export model
module.exports = mongoose.model('Participant', ParticipantSchema);