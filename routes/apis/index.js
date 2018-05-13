'use strict';

const
    express = require('express'),
    v1Controller = require('./v1');

let router = express.Router();

router.use('/v1', v1Controller);

module.exports = router;