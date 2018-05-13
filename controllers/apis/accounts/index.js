'use strict';

const
    express = require('express'),
    accountsService = require('../../../services/accounts'),
    renderJson = require('../../../lib/render-json.js');

let router = express.Router();

router.get('/', accountsService.getAccounts, renderJson);
router.post('/', accountsService.createAccount);
router.get('/:accountId', accountsService.getAccountById, renderJson);

module.exports = router;
