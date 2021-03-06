'use strict';

const
    server = require('./app')(),
    config = require('./configs');

server.create(config);
server.watcher();
server.start();  