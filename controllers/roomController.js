var Room = require('../models/room');
var Presenter = require('../models/presenter');
var Schedule = require('../models/schedule');
var Topic = require('../models/topic');
var Session = require('../models/session');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Rooms
exports.room_list = function(req,res,next) {
    Room.find()
    .sort([['roomNumber', 'ascending']])
    .exec(function (err, list_rooms) {
      if (err) { return next(err); }
      res.render('room_list', {title: 'Room List', room_list: list_rooms});
    });
};

// Display detail page of all Rooms
exports.room_detail = function(req,res,next) {

    async.parallel({
        room: function(callback) {
            Room.findById(req.params.id)
                .exec(callback)
        },
        schedule: function(callback) {
            Schedule.find({ 'room': req.params.id })
            .populate('topic')
            .populate('session')
            .populate('presenter')
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.room==null) {
            var err = new Error('Room not found');
            err.status = 404;
            return next(err);
        }
        res.render('room_detail', { title: 'Room Detail', room: results.room, schedules: results.schedule });
    })
};

// Display Room create form on GET.
exports.room_create_get = function(req,res) {
    res.render('room_form', { title: 'Create Room' });
};

// Handle Room create on POST
exports.room_create_post = [

    // Validate fields.
    body('roomNumber', 'Room Number is required').isLength({ min:1 }).trim(),
    body('building', 'Building is required').isLength({ min:1 }).trim(),
    body('capacity', 'Capacity is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('roomNumber').trim().escape(),
    sanitizeBody('building').trim().escape(),
    sanitizeBody('capacity').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('room_form', { title: 'Create Room', room: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Room object with escaped and trimmed data.
            var room = new Room(
                {
                    roomNumber: req.body.roomNumber,
                    building: req.body.building,
                    capacity: req.body.capacity
                });
            room.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new room record.
                res.redirect(room.url);
            });
        }
    }
];

// Display Room delete form on GET
exports.room_delete_get = function(req,res,next) {
    
    Room.findById(req.params.id)
    .exec(function (err, room) {
        if (err) { return next(err); }
        if (room==null) { // No results.
            res.redirect('/index/rooms');
        }
        // Successful, so render.
        res.render('room_delete', { title: 'Delete Room', room: room});
    })
};

// Handle Room delete on POST
exports.room_delete_post = function(req,res,next) {
    
    // Assume valid Room id in field.
    Room.findByIdAndRemove(req.body.id, function deleteRoom(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of rooms.
        res.redirect('/index/rooms');
    });
};

//Display Room update form on GET
exports.room_update_get = function(req,res,next) {
    Room.findById(req.params.id, function(err, room) {
        if (err) { return next(err); }
        if (room==null) { // No results.
            var err = new Error('Room not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('room_form', { title: 'Update Room', room: room });
    });
};

// Handle Room delete on POST
exports.room_update_post = [

    // Validate fields.
    body('roomNumber', 'Room Number is required').isLength({ min:1 }).trim(),
    body('building', 'Building is required').isLength({ min:1 }).trim(),
    body('capacity', 'Capacity is required').isLength({ min:1 }).trim(),

    // Sanitize fields.
    sanitizeBody('roomNumber').trim().escape(),
    sanitizeBody('building').trim().escape(),
    sanitizeBody('capacity').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Room object with escaped/trimmed data and current id.
        var room = new Room(
                {
                    roomNumber: req.body.roomNumber,
                    building: req.body.building,
                    capacity: req.body.capacity,
                    _id: req.params.id
                });

        if (!errors.isEmpty()) {
            // There are errors so render the form again with sanitized values and error messages.
            res.render('room_form', { title: 'Update Room', room: room, errors: errors.array()});
          return;
        }
        else {
            // Data from form is valid. Update the record.
            Room.findByIdAndUpdate(req.params.id, room, {}, function (err,theroom) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                    res.redirect(theroom.url);
            });
        }
    }
];