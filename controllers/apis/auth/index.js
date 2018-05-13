'use strict';

const
    express = require('express'),
    authService = require('../../../services/auth'),
    renderJson = require('../../../lib/render-json.js');

let router = express.Router();

router.post('/login', authService.login, renderJson);

module.exports = router;
