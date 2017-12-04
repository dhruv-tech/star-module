//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.use('/', require('./types/post/execute'));
router.use('/', require('./types/get/execute'));

module.exports = router;