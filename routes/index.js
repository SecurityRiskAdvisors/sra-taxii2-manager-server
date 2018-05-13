'use strict';

const
    apiRoute = require('./apis'),
    httpsRedirect = require('../lib/https-redirect');

function init(server) {
    server.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    }, httpsRedirect);

    server.use('/taxii2manager', apiRoute);  
}

module.exports = {
    init: init
};