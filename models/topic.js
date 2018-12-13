var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TopicSchema = new Schema (
{
    //topicCode: {type: Number, required: true},
	title: {type: String, required: true, max: 100},
	description: {type: String, required: true, max: 150},
}
);

// Virtual for topic's URL
TopicSchema
.virtual('url')
.get(function () {
	return '/index/topic/' + this._id;
});

// Export model
module.exports = mongoose.model('Topic', TopicSchema);