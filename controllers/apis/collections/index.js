'use strict';

const
    express = require('express'),
    collectionsService = require('../../../services/collections'),
    renderJson = require('../../../lib/render-json.js');

let router = express.Router();

router.get('/', collectionsService.getCollections, renderJson);
router.get('/:title', collectionsService.getCollectionByTitle, renderJson);
router.post('/', collectionsService.createCollection);

module.exports = router;
