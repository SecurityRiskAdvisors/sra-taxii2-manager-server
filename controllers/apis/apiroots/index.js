'use strict';

const
    express = require('express'),
    apiRootsService = require('../../../services/apiroots'),
    renderJson = require('../../../lib/render-json.js');

let router = express.Router();

router.get('/', apiRootsService.getApiRoots, renderJson);
router.post('/', apiRootsService.createApiRoot);

module.exports = router;
