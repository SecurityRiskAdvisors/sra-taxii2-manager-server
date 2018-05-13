'use strict';

const
    express = require('express'),
    rolesService = require('../../../services/roles'),
    renderJson = require('../../../lib/render-json.js');

let router = express.Router();

router.get('/', rolesService.getRoles, renderJson);

module.exports = router;
