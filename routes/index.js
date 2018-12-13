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

/// Schedule ROUTES ///

// GET index home page.
router.get('/', schedule_controller.index);

// GET request for creating a Schedule. NOTE This must come before routes that display Schedule (uses id).
router.get('/schedule/create', schedule_controller.schedule_create_get);

// POST request for creating Schedule.
router.post('/schedule/create', schedule_controller.schedule_create_post);

// GET request to delete Schedule.
router.get('/schedule/:id/delete', schedule_controller.schedule_delete_get);

// POST request to delete Schedule.
router.post('/schedule/:id/delete', schedule_controller.schedule_delete_post);

// GET request to update Schedule.
router.get('/schedule/:id/update', schedule_controller.schedule_update_get);

// POST request to update Schedule.
router.post('/schedule/:id/update', schedule_controller.schedule_update_post);

// GET request for one Schedule.
router.get('/schedule/:id', schedule_controller.schedule_detail);

// GET request for list of all Schedule items.
router.get('/schedules', schedule_controller.schedule_list);

/// HighSchool ROUTES ///

// GET request for creating HighSchool. NOTE This must come before route for id (i.e. display HighSchool).
router.get('/highschool/create', highschool_controller.highschool_create_get);

// POST request for creating HighSchool.
router.post('/highschool/create', highschool_controller.highschool_create_post);

// GET request to delete HighSchool.
router.get('/highschool/:id/delete', highschool_controller.highschool_delete_get);

// POST request to delete HighSchool.
router.post('/highschool/:id/delete', highschool_controller.highschool_delete_post);

// GET request to update HighSchool.
router.get('/highschool/:id/update', highschool_controller.highschool_update_get);

// POST request to update HighSchool.
router.post('/highschool/:id/update', highschool_controller.highschool_update_post);

// GET request for one HighSchool.
router.get('/highschool/:id', highschool_controller.highschool_detail);

// GET request for list of all HighSchools.
router.get('/highschools', highschool_controller.highschool_list);

/// Participant ROUTES ///

// GET request for creating Participant. NOTE This must come before route for id (i.e. display Participant).
router.get('/participant/create', participant_controller.participant_create_get);

// POST request for creating Participant.
router.post('/participant/create', participant_controller.participant_create_post);

// GET request to delete Participant.
router.get('/participant/:id/delete', participant_controller.participant_delete_get);

// POST request to delete Participant.
router.post('/participant/:id/delete', participant_controller.participant_delete_post);

// GET request to update Participant.
router.get('/participant/:id/update', participant_controller.participant_update_get);

// POST request to update Participant.
router.post('/participant/:id/update', participant_controller.participant_update_post);

// GET request for one Participant.
router.get('/participant/:id', participant_controller.participant_detail);

// GET request for list of all Participants.
router.get('/participants', participant_controller.participant_list);

/// Presenter ROUTES ///

// GET request for creating Presenter. NOTE This must come before route for id (i.e. display Presenter).
router.get('/presenter/create', presenter_controller.presenter_create_get);

// POST request for creating Presenter.
router.post('/presenter/create', presenter_controller.presenter_create_post);

// GET request to delete Presenter.
router.get('/presenter/:id/delete', presenter_controller.presenter_delete_get);

// POST request to delete Presenter.
router.post('/presenter/:id/delete', presenter_controller.presenter_delete_post);

// GET request to update Presenter.
router.get('/presenter/:id/update', presenter_controller.presenter_update_get);

// POST request to update Presenter.
router.post('/presenter/:id/update', presenter_controller.presenter_update_post);

// GET request for one Presenter.
router.get('/presenter/:id', presenter_controller.presenter_detail);

// GET request for list of all Presenters.
router.get('/presenters', presenter_controller.presenter_list);

/// Room ROUTES ///

// GET request for creating Room. NOTE This must come before route for id (i.e. display Room).
router.get('/room/create', room_controller.room_create_get);

// POST request for creating Room.
router.post('/room/create', room_controller.room_create_post);

// GET request to delete Room.
router.get('/room/:id/delete', room_controller.room_delete_get);

// POST request to delete Room.
router.post('/room/:id/delete', room_controller.room_delete_post);

// GET request to update Room.
router.get('/room/:id/update', room_controller.room_update_get);

// POST request to update Room.
router.post('/room/:id/update', room_controller.room_update_post);

// GET request for one Room.
router.get('/room/:id', room_controller.room_detail);

// GET request for list of all Rooms.
router.get('/rooms', room_controller.room_list);

/// Session ROUTES ///

// GET request for creating Session. NOTE This must come before route for id (i.e. display Session).
router.get('/session/create', session_controller.session_create_get);

// POST request for creating Session.
router.post('/session/create', session_controller.session_create_post);

// GET request to delete Session.
router.get('/session/:id/delete', session_controller.session_delete_get);

// POST request to delete Session.
router.post('/session/:id/delete', session_controller.session_delete_post);

// GET request to update Session.
router.get('/session/:id/update', session_controller.session_update_get);

// POST request to update Session.
router.post('/session/:id/update', session_controller.session_update_post);

// GET request for one Session.
router.get('/session/:id', session_controller.session_detail);

// GET request for list of all Sessions.
router.get('/sessions', session_controller.session_list);

/// Topic ROUTES ///

// GET request for creating Topic. NOTE This must come before route for id (i.e. display Topic).
router.get('/topic/create', topic_controller.topic_create_get);

// POST request for creating Topic.
router.post('/topic/create', topic_controller.topic_create_post);

// GET request to delete Topic.
router.get('/topic/:id/delete', topic_controller.topic_delete_get);

// POST request to delete Topic.
router.post('/topic/:id/delete', topic_controller.topic_delete_post);

// GET request to update Topic.
router.get('/topic/:id/update', topic_controller.topic_update_get);

// POST request to update Topic.
router.post('/topic/:id/update', topic_controller.topic_update_post);

// GET request for one Topic.
router.get('/topic/:id', topic_controller.topic_detail);

// GET request for list of all Topics.
router.get('/topics', topic_controller.topic_list);

module.exports = router;
