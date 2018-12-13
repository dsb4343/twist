var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomSchema = new Schema (
{
    roomNumber: {type: Number, required: true},
	building: {type: String, required: true, max: 100},
	capacity: {type: Number, required: true},
}
);

// Virtual for room's URL
RoomSchema
.virtual('url')
.get(function () {
	return '/index/room/' + this._id;
});

// Export model
module.exports = mongoose.model('Room', RoomSchema);