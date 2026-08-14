const express = require('express');
const router = express.Router();
const { recommendProperties, chatAssistant } = require('../controllers/aiController');

router.post('/recommend', recommendProperties);
router.post('/chat', chatAssistant);

module.exports = router;
