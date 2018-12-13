var Session = require('../models/session');
var Presenter = require('../models/presenter');
var Schedule = require('../models/schedule');
var Topic = require('../models/topic');
var Room = require('../models/room');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Sessions
exports.session_list = function(req,res,next) {
    Session.find()
    .sort([['time', 'ascending']])
    .exec(function (err, list_sessions) {
      if (err) { return next(err); }
      res.render('session_list', {title: 'Session List', session_list: list_sessions});
    });
};

// Display detail page of all Sessions
exports.session_detail = function(req,res,next) {

    async.parallel({
        session: function(callback) {
            Session.findById(req.params.id)
                .exec(callback)
        },
        schedule: function(callback) {
            Schedule.find({ 'session': req.params.id })
            .populate('topic')
            .populate('presenter')
            .populate('room')
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.session==null) {
            var err = new Error('Session not found');
            err.status = 404;
            return next(err);
        }
        res.render('session_detail', { title: 'Session Detail', session: results.session, schedules: results.schedule });
    })
};

// Display Session create form on GET.
exports.session_create_get = function(req,res,next) {
    res.render('session_form', { title: 'Create Session'})
};

// Handle Session create on POST
exports.session_create_post = [

    // Validate fields.
    body('startTime', 'Start time is required').isLength({ min:1 }).trim(),
    body('endTime', 'End time is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('startTime').trim().escape(),
    sanitizeBody('endTime').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('session_form', { title: 'Create Session', session: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Session object with escaped and trimmed data.
            var session = new Session(
                {
                    startTime: req.body.startTime,
                    endTime: req.body.endTime
                });
            session.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new session record.
                res.redirect(session.url);
            });
        }
    }
];

// Display Session delete form on GET
exports.session_delete_get = function(req,res,next) {
    
    Session.findById(req.params.id)
    .exec(function (err, session) {
        if (err) { return next(err); }
        if (session==null) { // No results.
            res.redirect('/index/sessions');
        }
        // Successful, so render.
        res.render('session_delete', { title: 'Delete Session', session: session});
    })
};

// Handle Session delete on POST
exports.session_delete_post = function(req,res,next) {
    
    // Assume valid Participant id in field.
    Session.findByIdAndRemove(req.body.id, function deleteSession(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of sessions.
        res.redirect('/index/sessions');
    });
};

//Display Session update form on GET
exports.session_update_get = function(req,res,next) {
    Session.findById(req.params.id, function(err, session) {
        if (err) { return next(err); }
        if (session==null) { // No results.
            var err = new Error('Session not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('session_form', { title: 'Update Session', session: session });
    });
};

// Handle Session delete on POST
exports.session_update_post = [

    // Validate fields.
    body('startTime', 'Start time is required').isLength({ min:1 }).trim(),
    body('endTime', 'End time is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('startTime').trim().escape(),
    sanitizeBody('endTime').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Session object with escaped/trimmed data and current id.
        var session = new Session(
                {
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    _id: req.params.id
                });

        if (!errors.isEmpty()) {
            // There are errors so render the form again with sanitized values and error messages.
            res.render('session_form', { title: 'Update ession', session: session, errors: errors.array()});
          return;
        }
        else {
            // Data from form is valid. Update the record.
            ession.findByIdAndUpdate(req.params.id, session, {}, function (err,thesession) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                    res.redirect(thesession.url);
            });
        }
    }
];