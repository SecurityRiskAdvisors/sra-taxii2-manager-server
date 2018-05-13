'use strict';

let localConfig = {
    hostname: 'localhost',
    httpPort: 4000,
    httpsPort: 4001,
    connectionString: "mongodb://mongo:27017/",
    // if you're using a taxii management application it needs to point to the same conf DB to manage this instance
    confDb: "taxii2config",
    certDir: "/opt/taxii/certs"
};

module.exports = localConfig;
