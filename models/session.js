var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SessionSchema = new Schema (
{
    //sessionNum: {type: Number, required: true},
	startTime: {type: String, required: true, max: 5},
    endTime: {type: String, required: true, max: 5},
}
);

//virtual for session's time slot
SessionSchema
.virtual('time')
.get(function(){
    return this.startTime + ' - ' + this.endTime;
})

// Virtual for session URL
SessionSchema
.virtual('url')
.get(function () {
	return '/index/session/' + this._id;
});

// Export model
module.exports = mongoose.model('Session', SessionSchema);