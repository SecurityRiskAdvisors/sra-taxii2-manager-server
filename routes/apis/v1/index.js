'use strict';

const
    express = require('express'),
    accountsController = require('../../../controllers/apis/accounts'),
    apiRootsController = require('../../../controllers/apis/apiroots'),
    collectionsController = require('../../../controllers/apis/collections'),
    rolesController = require('../../../controllers/apis/roles'),
    authController = require('../../../controllers/apis/auth');

let router = express.Router();

router.use('/accounts', accountsController);
router.use('/apiroots', apiRootsController);
router.use('/collections', collectionsController);
router.use('/auth', authController);
router.use('/roles', rolesController);

module.exports = router;