const Chokidar = require('chokidar');
const Queue = require('bull');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid4 = require('uuid/v4');
require('dotenv').config();

const tempFilePathDir = path.basename(process.env.FILE_TEMP_DIR);
var tempFileRegexStr = tempFilePathDir + "$";
var tempFileRegex = new RegExp(tempFileRegexStr,"g");

let ignorePaths = [
    /(^|[\/\\])\../,
    /errors$/,
    /Untitled Folder$/,
    /New Folder$/,
    /logs$/
];

const collectionNameRegex = /^[A-Za-z0-9\ \-\.\_]+$/;

const sharedFolderWatcher = async (server) => {
    require('run-middleware')(server);

    server.runMiddleware[util.promisify.custom] = (path, options) => {
        return new Promise((resolve, reject) => {
            server.runMiddleware(path, options, function (code,data,headers) {
                let payload = {code: code, data: data, headers: headers};
                resolve(payload);
            });
        });
    };

    const runMiddlewarePromise = util.promisify(server.runMiddleware);

    const runMiddlewareAsync = async (path, options) => {
        try {
            const middlewareRes = await runMiddlewarePromise(path, options);
            return middlewareRes;
        } catch(e) {
            console.error("NOT IMPLEMENTED: ", e);
            return false;
        }
    }

    const handleDirAdd = async (fEventPath) => {
        const fileName = path.basename(fEventPath);
        const filePath = path.dirname(fEventPath);
    
        let newFileStats = fs.statSync(fEventPath);
    
        if(newFileStats.isDirectory() 
            && filePath == process.env.FILE_TEMP_DIR
            && fEventPath != process.env.FILE_TEMP_DIR) {
            if(fileName.match(collectionNameRegex) != null) {
                console.log("new directory name, performing action: ", fileName);

                let defaultApiRootRes = await runMiddlewareAsync('/taxii2manager/v1/apiroots/apiroot1',{
                    secure: true,
                    connection: {},
                    method:'GET'                    
                });

                let jsonResp = JSON.parse(defaultApiRootRes.data);
                if(jsonResp.length > 0) {
                    let apiroot1 = jsonResp[0];
                    let newCollectionData = {
                        title: fileName,
                        apiRoot: apiroot1._id,
                        media_types: ["application/vnd.oasis.stix+json; version=2.0"]
                    }

                    let newCollectionRes = await runMiddlewareAsync('/taxii2manager/v1/collections',{
                        connection: {},
                        method:'post', 
                        body:newCollectionData
                    });

                    let collJsonResp = JSON.parse(newCollectionRes.data);
                    if(!collJsonResp.hasOwnProperty("errors")) { 
                        console.log("new collection: ", newCollectionRes.data);
                    }
                }
                
            } else {
                console.log("INVALID DIRECTORY NAME: ", fileName);
            }
        }
    }

    const handleFileAdd = async (fEventPath) => {
        const fileName = path.basename(fEventPath);
        const filePath = path.dirname(fEventPath);

        const collectionName = filePath.replace(process.env.FILE_TEMP_DIR + path.sep, '');
        if(collectionName.match(new RegExp('\/' + path.sep))) {
            console.log("NOT IMPLEMENTED ERROR: too many nested dirs");
            return false;
        }

        try {
            let collectionRes = await runMiddlewareAsync('/taxii2manager/v1/collections/' + collectionName,{
                secure: true,
                connection: {},
                method:'GET'                    
            });

            let collJsonResp = JSON.parse(collectionRes.data);
            if(collJsonResp.length > 0) {
                let foundCollection = collJsonResp[0]; 
                const uuid = uuid4();

                let importStixQueue = new Queue('importStix2', {redis: {port: 6379, host: 'sra-taxii2-redis'}});
                let jobResult = await importStixQueue.add('importStix2',{
                    apiRoot: 'apiroot1',
                    collection: foundCollection.id,
                    file: foundCollection.title + path.sep + fileName
                }, {jobId: uuid});

                console.log("added job: ", jobResult);
            } else {
                // @TODO, might need to recurse once here if not found and call handleDirAdd due to possible race condition?
            }

        } catch(e) {
            console.log(e);
        }
        /*if(!collJsonResp.hasOwnProperty("errors")) { 
            console.log("new collection: ", newCollectionRes.data);
        }*/

        
    }

    let watcher = Chokidar.watch(process.env.FILE_TEMP_DIR, {
        ignored: ignorePaths,
        persistent: true
      });
    
    let log = console.log.bind(console);
    // Add event listeners.
    watcher
      .on('add', path => { 
          log(`File ${path} has been added`);
          handleFileAdd(path).then(() => {
            return Promise.resolve(true);
        });
      })
      .on('change', path => log(`File ${path} has been changed`))
      .on('unlink', path => log(`File ${path} has been removed`))
      .on('addDir', (path) => {
        log(`Directory ${path} has been added`);
        handleDirAdd(path).then(() => {
            return Promise.resolve(true);
        });
      })
      .on('unlinkDir', path => log(`Directory ${path} has been removed`))
      .on('error', error => log(`Watcher error: ${error}`))
      .on('ready', () => log('Watching for changes to temporary file directory.'));
}
 
module.exports = sharedFolderWatcher;


/*
@TODO - on failures move files to errors directory that doesnt get watched, output file + error text there
*/