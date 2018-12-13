var Participant = require('../models/participant');
var HighSchool = require('../models/highschool');
var Schedule = require('../models/schedule');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Participant
exports.participant_list = function(req,res,next) {
    Participant.find()
    .sort([['lastName', 'ascending']])
    .exec(function (err, list_participants) {
      if (err) { return next(err); }
      res. render('participant_list', {title: 'Participant List', participant_list: list_participants});
    });
};

// Display detail page of all Participants
exports.participant_detail = function(req,res, next) {

    async.parallel({
        participant: function(callback) {
            Participant.findById(req.params.id)
                .populate('highSchool')
                .exec(callback)
        },
        highSchool: function(callback) {
            Participant.find({ 'highschool': req.params.id })
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.participant==null) {
            var err = new Error('Participant not found');
            err.status = 404;
            return next(err);
        }
        res.render('participant_detail', { title: 'Participant Detail', participant: results.participant, highSchools: results.highSchool });
    })
};

// Display Participant create form on GET.
exports.participant_create_get = function(req,res,next) {
    HighSchool.find()
    .sort([['name', 'ascending']])
    .exec(function (err, highSchools) {
        if (err) { return next(err); }   
        res.render('participant_form', { title: 'Create Participant', highSchool_list: highSchools });
    });
};

// Handle Participant create on POST
exports.participant_create_post = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('address', 'Address is required').isLength({ min:1 }).trim(),
    body('email', 'Email is required').isLength({ min: 1 }).trim(),
    body('highSchool', 'High School is required').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('address').trim().escape(),
    sanitizeBody('email').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('participant_form', { title: 'Create Participant', participant: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Participant object with escaped and trimmed data.
            var participant = new Participant(
                { lastName: req.body.lastName,
                  firstName: req.body.firstName,
                  address: req.body.address,
                  highSchool: req.body.highSchool,
                  email: req.body.email
                });
            participant.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new participant record.
                res.redirect(participant.url);
            });
        }
    }
];

// Display Participant delete form on GET
exports.participant_delete_get = function(req,res,next) {
    
    Participant.findById(req.params.id)
    .exec(function (err, participant) {
        if (err) { return next(err); }
        if (participant==null) { // No results.
            res.redirect('/index/participants');
        }
        // Successful, so render.
        res.render('participant_delete', { title: 'Delete Participant', participant: participant});
    })
};

// Handle Participant delete on POST
exports.participant_delete_post = function(req,res,next) {
    
    // Assume valid Participant id in field.
    Participant.findByIdAndRemove(req.body.participantid, function deleteParticipant(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of participants.
        res.redirect('/index/participants');
    });
};

//Display Participant update form on GET
exports.participant_update_get = function(req,res,next) {

    async.parallel({
        participant: function(callback) {
            Participant.findById(req.params.id).populate('highSchool').exec(callback)
        },
        highSchools: function(callback) {
            HighSchool.find(callback)
        },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.participant==null) { // No results.
                var err = new Error('Participant not found');
                err.status = 404;
                return next(err);
            }
            res.render('participant_form', { title: 'Update  Participant', highSchool_list : results.highSchools, selected_highSchool : results.participant.highSchool._id, participant:results.participant });
        });

};

// Handle Participant update on POST
exports.participant_update_post = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('address', 'Address is required').isLength({ min:1 }).trim(),
    body('email', 'Email is required').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('address').trim().escape(),
    sanitizeBody('email').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Participant object with escaped/trimmed data and current id.
        var participant = new Participant(
          { lastName: req.body.lastName,
            firstName: req.body.firstName,
            address: req.body.address,
            highSchool: req.body.highSchool,
            email: req.body.email,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors so render the form again with sanitized values and error messages.
            res.render('participant_form', { title: 'Update Participant', participant: participant, errors: errors.array()});
          return;
        }
        else {
            // Data from form is valid. Update the record.
            Participant.findByIdAndUpdate(req.params.id, participant, {}, function (err,theparticipant) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                    res.redirect(theparticipant.url);
            });
        }
    }
];

// Display Participant create form on GET.
exports.participant_create_user_get = function(req,res,next) {
    HighSchool.find()
    .sort([['name', 'ascending']])
    .exec(function (err, highSchools) {
        if (err) { return next(err); }   
        res.render('participant_user_form', { title: 'Create Participant', highSchool_list: highSchools });
    });
};

// Handle Participant create on POST
exports.participant_create_user_post = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('address', 'Address is required').isLength({ min:1 }).trim(),
    body('email', 'Email is required').isLength({ min: 1 }).trim(),
    body('highSchool', 'High School is required').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('address').trim().escape(),
    sanitizeBody('email').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('participant_user_form', { title: 'Create Participant', participant: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Participant object with escaped and trimmed data.
            var participant = new Participant(
                { lastName: req.body.lastName,
                  firstName: req.body.firstName,
                  address: req.body.address,
                  highSchool: req.body.highSchool,
                  email: req.body.email
                });
            participant.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new participant record.
                res.redirect('/users/submitted');
            });
        }
    }
];

// Display submission message
exports.participant_submitted = function(req,res,next) {
      res. render('participant_submitted', {title: 'Thank You For Your Submission'});
};