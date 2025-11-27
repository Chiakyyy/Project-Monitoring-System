const express = require('express');
const router = express.Router();

const projectCtrl = require('../controllers/projectController');
const taskCtrl = require('../controllers/taskController');
const statsCtrl = require('../controllers/statsController');

// Project Routes
router.post('/projects', projectCtrl.createProject);
router.get('/projects', projectCtrl.getAllProjects);
router.put('/projects/:id/validate', projectCtrl.validateProject);

// Task Routes
router.post('/tasks', taskCtrl.addTask);
router.post('/comments', taskCtrl.addComment);
router.post('/tasks/review', taskCtrl.peerReviewTask); // For employees voting [cite: 21]
router.get('/notifications', taskCtrl.getNotifications); // For the Chef [cite: 11]
router.get('/tasks', taskCtrl.getAllTasks);
router.get('/tasks/details', taskCtrl.getTaskFullDetails);
router.put('/tasks/:id/status', taskCtrl.updateTaskStatus);

// Stats Route
router.get('/stats', statsCtrl.getDashboardStats); // For the dashboard 

module.exports = router;