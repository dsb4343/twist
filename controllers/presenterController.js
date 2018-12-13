var Presenter = require('../models/presenter');
var Schedule = require('../models/schedule');
var Topic = require('../models/topic');
var Room = require('../models/room');
var Session = require('../models/session');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Presenters
exports.presenter_list = function(req,res,next) {
    Presenter.find()
    .sort([['lastName', 'ascending']])
    .exec(function (err, list_presenters) {
      if (err) { return next(err); }
      res.render('presenter_list', {title: 'Presenter List', presenter_list: list_presenters});
    });
};

// Display detail page of all Presenters
exports.presenter_detail = function(req,res,next) {

    async.parallel({
        presenter: function(callback) {
            Presenter.findById(req.params.id)
                .exec(callback)
        },
        schedule: function(callback) {
            Schedule.find({ 'presenter': req.params.id })
            .populate('topic')
            .populate('session')
            .populate('room')
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.presenter==null) {
            var err = new Error('Presenter not found');
            err.status = 404;
            return next(err);
        }
        res.render('presenter_detail', { title: 'Presenter Detail', presenter: results.presenter, schedules: results.schedule });
    })
};

// Display Presenter create form on GET.
exports.presenter_create_get = function(req,res,next) {
    res.render('presenter_form', { title: 'Create Presenter' });
};

// Handle Presenter create on POST
exports.presenter_create_post = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('occupation', 'Occupation Required').isLength({ min:1 }).trim(),
    body('mainPhone', 'Main Phone is required').isLength({ min:1 }).trim(),
    body('mobilePhone', 'Mobile Phone is required').isLength({ min:1 }).trim(),
    body('email', 'Email is required').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('occupation').trim().escape(),
    sanitizeBody('mainPhone').trim().escape(),
    sanitizeBody('mobilePhone').trim().escape(),
    sanitizeBody('email').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('presenter', { title: 'Create Presenter', presenter: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Presenter object with escaped and trimmed data.
            var presenter = new Presenter(
                {
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    occupation: req.body.occupation,
                    mainPhone: req.body.mainPhone,
                    mobilePhone: req.body.mobilePhone,
                    email: req.body.email
                });
            presenter.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new presenter record.
                res.redirect(presenter.url);
            });
        }
    }
];

// Display Presenter delete form on GET
exports.presenter_delete_get = function(req,res, next) {
    
    Presenter.findById(req.params.id)
    .exec(function (err, presenter) {
        if (err) { return next(err); }
        if (presenter==null) { // No results.
        res.redirect('/index/presenters');
        }
        // Successful, so render.
        res.render('presenter_delete', { title: 'Delete Presenter', presenter: presenter});
    })
};

// Handle Presenter delete on POST
exports.presenter_delete_post = function(req,res,next) {
    
    // Assume valid Presenter id in field.
    Presenter.findByIdAndRemove(req.body.id, function deletePresenter(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of presenters.
        res.redirect('/index/presenters');
    })
};

//Display Presenter update form on GET
exports.presenter_update_get = function(req,res,next) {
   Presenter.findById(req.params.id, function(err, presenter) {
        if (err) { return next(err); }
        if (presenter==null) { // No results.
            var err = new Error('Presenter not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('presenter_form', { title: 'Update Presenter', presenter: presenter });
    });
};

// Handle Presenter delete on POST
exports.presenter_update_post = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('occupation', 'Occupation Required').isLength({ min:1 }).trim(),
    body('mainPhone', 'Main Phone is required').isLength({ min:1 }).trim(),
    body('mobilePhone', 'Mobile Phone is required').isLength({ min:1 }).trim(),
    body('email', 'Email is required').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('occupation').trim().escape(),
    sanitizeBody('mainPhone').trim().escape(),
    sanitizeBody('mobilePhone').trim().escape(),
    sanitizeBody('email').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Presenter object with escaped/trimmed data and current id.
        var presenter = new Presenter(
                {
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    occupation: req.body.occupation,
                    mainPhone: req.body.mainPhone,
                    mobilePhone: req.body.mobilePhone,
                    email: req.body.email,
                    _id: req.params.id
                });

        if (!errors.isEmpty()) {
            // There are errors so render the form again with sanitized values and error messages.
            res.render('presenter_form', { title: 'Update Presenter', presenter: presenter, errors: errors.array()});
          return;
        }
        else {
            // Data from form is valid. Update the record.
            Presenter.findByIdAndUpdate(req.params.id, presenter, {}, function (err,thepresenter) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                    res.redirect(thepresenter.url);
            });
        }
    }
];