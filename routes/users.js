var express = require('express');
var router = express.Router();

// Require controller modules
var highschool_controller = require('../controllers/highschoolController');
var participant_controller = require('../controllers/participantController');
var presenter_controller = require('../controllers/presenterController');
var room_controller = require('../controllers/roomController');
var schedule_controller = require('../controllers/scheduleController');
var session_controller = require('../controllers/sessionController');
var topic_controller = require('../controllers/topicController');

// GET request for creating Participant. NOTE This must come before route for id (i.e. display Participant).
router.get('/', participant_controller.participant_create_user_get);

// POST request for creating Participant.
router.post('/', participant_controller.participant_create_user_post);

// Submitted
router.get('/submitted', participant_controller.participant_submitted);

module.exports = router;
