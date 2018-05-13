'use strict';

const
    express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    http = require('http'),
    https = require('https'),
    // new stuff
    logger = require('morgan'),
    cookieParser = require('cookie-parser');

module.exports = function() {
  let server = express(),
      create,
      start;

  create = function(config) { 
      let routes = require('./routes');

      server.set('env', config.env);
      server.set('httpPort', config.httpPort);
      server.set('httpsPort', config.httpsPort);
      server.set('hostname', config.hostname);
      server.set('viewDir', config.viewDir);
      // @TODO - remove dupe after helmet
      server.disable('x-powered-by');

      let sslCertDir = config.certDir.replace(/^(.+?)\/*?$/, "$1");
      server.set('sslOptions', {
          key: fs.readFileSync(sslCertDir + '/key.pem'),
          cert: fs.readFileSync(sslCertDir + '/cert.pem'),
          passphrase: 'PUT_YOUR_PASSPHRASE_HERE_OR_CHANGE_TO_GET_THIS_FROM_SOMEWHERE_ELSE'
      });

      mongoose.connect(config.connectionString + config.confDb);

      // @TODO - remove debugging
      mongoose.set('debug', function (collectionName, method, query, doc) {
          console.log("colName: ", collectionName);
          console.log("query: ", query);
          console.log("method: ", method);
      });
        
      server.use(cookieParser());
      server.use(express.json());
      server.use(express.urlencoded({ extended: false }));

      server.use(logger('dev'))

      // @TODO this definitely needs fixing, do not * for CORS
      server.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

      routes.init(server); 
  };

  start = function() {
      let hostname = server.get('hostname'),
          httpPort = server.get('httpPort'),
          httpsPort = server.get('httpsPort'),
          sslOptions = server.get('sslOptions');

      http.createServer(server).listen(httpPort, function () {
          console.log('Taxii Manager API HTTP redirect server listening on - http://' + hostname + ':' + httpPort);
      });
      
      https.createServer(sslOptions, server).listen(httpsPort, function () {
          console.log('HTTPS Taxii Manager API listening on - https://' + hostname + ':' + httpsPort);
      });
  };

  return {
      create: create,
      start: start
  };
};
