var HighSchool = require('../models/highschool');
var Participant = require('../models/participant');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all HighSchools
exports.highschool_list = function(req,res,next) {
    HighSchool.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_highschools) {
      if (err) { return next(err); }
      res.render('highschool_list', {title: 'Highschool List', highschool_list: list_highschools});
    });
};

// Display detail page of all HighSchools
exports.highschool_detail = function(req,res,next) {

    async.parallel({
        highSchool: function(callback) {
            HighSchool.findById(req.params.id)
                .exec(callback)
        },
        highSchools_participants: function(callback) {
          Participant.find({ 'highSchool': req.params.id }, ['lastName', 'firstName'])
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.highSchool==null) { // No results.
            var err = new Error('Highschool not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('highschool_detail', { title: 'Highschool Detail', highSchool: results.highSchool, highSchool_participants: results.highSchools_participants } );
    });

};

// Display HighSchool create form on GET.
exports.highschool_create_get = function(req,res,next) {
    res.render('highschool_form', { title: 'Create Highschool' })
};

// Handle HighSchool create on POST
exports.highschool_create_post = [

    // Validate fields.
    body('name', 'Name is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('highschool_form', { title: 'Create Highschool', highschool: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Highschool object with escaped and trimmed data.
            var highschool = new HighSchool(
                {
                    name: req.body.name
                });
            highschool.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new highschool record.
                res.redirect(highschool.url);
            });
        }
    }
];

// Display HighSchool delete form on GET
exports.highschool_delete_get = function(req,res,next) {
    
    HighSchool.findById(req.params.id)
        .exec(function (err, highschool){
        if (err) { return next(err); }
        if (highschool==null) { // No results.
            res.redirect('/index/highschools');
        }
        // Successful, so render.
        res.render('highschool_delete', { title: 'Delete Highschool', highschool: highschool});
    })
};

// Handle HighSchool delete on POST
exports.highschool_delete_post = function(req,res,next) {
    
    // Assume valid Highschool id in field.
    HighSchool.findByIdAndRemove(req.body.highschoolid, function deleteHighSchool(err){
        if (err) { return next(err); }
        // Success, so redirect to list of highschools.
        res.redirect('/index/highschools');
    })
};

//Display HighSchool update form on GET
exports.highschool_update_get = function(req,res,next) {
    HighSchool.findById(req.params.id, function(err, highschool) {
        if (err) { return next(err); }
        if (highschool==null) { // No results.
            var err = new Error('Highschool not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('highschool_form', { title: 'Update Highschool', highschool: highschool });
    });
};

// Handle HighSchool update on POST
exports.highschool_update_post = [

    // Validate fields.
    body('name', 'Name is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('name').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Highschool object with escaped/trimmed data and current id.
        var highschool = new HighSchool(
                {
                    name: req.body.name,
                    _id: req.params.id
                });

        if (!errors.isEmpty()) {
            // There are errors so render the form again with sanitized values and error messages.
            res.render('highschool_form', { title: 'Update Highschool', highschool: highschool, errors: errors.array()});
          return;
        }
        else {
            // Data from form is valid. Update the record.
            Participant.findByIdAndUpdate(req.params.id, highschool, {}, function (err,thehighschool) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                    res.redirect(thehighschool.url);
            });
        }
    }
];