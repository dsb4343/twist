var Topic = require('../models/topic');
var Presenter = require('../models/presenter');
var Schedule = require('../models/schedule');
var Room = require('../models/room');
var Session = require('../models/session');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Topics
exports.topic_list = function(req,res,next) {
    Topic.find()
    .sort([['title', 'ascending']])
    .exec(function (err, list_topics) {
      if (err) { return next(err); }
      res.render('topic_list', {title: 'Topic List', topic_list: list_topics});
    });
};

// Display detail page of all Topics
exports.topic_detail = function(req,res,next) {

    async.parallel({
        topic: function(callback) {
            Topic.findById(req.params.id)
                .exec(callback)
        },
        schedule: function(callback) {
            Schedule.find({ 'topic': req.params.id })
            .populate('presenter')
            .populate('session')
            .populate('room')
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.topic==null) {
            var err = new Error('Topic not found');
            err.status = 404;
            return next(err);
        }
        res.render('topic_detail', { title: 'Topic Detail', topic: results.topic, schedules: results.schedule });
    })
};


// Display Topic create form on GET.
exports.topic_create_get = function(req,res,next) {
    res.render('topic_form', { title: 'Create Topic' })
};

// Handle Topic create on POST
exports.topic_create_post = [

    // Validate fields.
    body('title', 'Title is required').isLength({ min:1 }).trim(),
    body('description', 'Description is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('description').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('topic_form', { title: 'Create Topic', topic: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Topic object with escaped and trimmed data.
            var topic = new Topic(
                {
                    title: req.body.title,
                    description: req.body.description
                });
            topic.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new topic record.
                res.redirect(topic.url);
            });
        }
    }
];

// Display Topic delete form on GET
exports.topic_delete_get = function(req,res,next) {
    
    Topic.findById(req.params.id)
    .exec(function (err, topic) {
        if (err) { return next(err); }
        if (topic==null) { // No results.
            res.redirect('/index/topics');
        }
        // Successful, so render.
        res.render('topic_delete', { title: 'Delete Topic', topic:topic});
    })
};

// Handle Topic delete on POST
exports.topic_delete_post = function(req,res,next) {
    
    // Assume valid Topic id in field.
    Topic.findByIdAndRemove(req.body.id, function deleteTopic(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of topics.
        res.redirect('/index/topics');
    });
};

//Display Topic update form on GET
exports.topic_update_get = function(req,res,next) {
    Topic.findById(req.params.id, function(err, topic) {
        if (err) { return next(err); }
        if (topic==null) { // No results.
            var err = new Error('Topic not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('topic_form', { title: 'Update Topic', topic: topic });
    });
};

// Handle Topic delete on POST
exports.topic_update_post = [

    // Validate fields.
    body('title', 'Title is required').isLength({ min:1 }).trim(),
    body('description', 'Description is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('description').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Topic object with escaped/trimmed data and current id.
        var topic = new Topic(
                {
                    title: req.body.title,
                    description: req.body.description,
                    _id: req.params.id
                });

        if (!errors.isEmpty()) {
            // There are errors so render the form again with sanitized values and error messages.
            res.render('topic_form', { title: 'Update Topic', topic: topic, errors: errors.array()});
          return;
        }
        else {
            // Data from form is valid. Update the record.
            Topic.findByIdAndUpdate(req.params.id, topic, {}, function (err,thetopic) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                    res.redirect(thetopic.url);
            });
        }
    }
];