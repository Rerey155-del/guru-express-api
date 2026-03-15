const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.post('/', announcementController.sendAnnouncement);
router.get('/', announcementController.getAnnouncements);

module.exports = router;
