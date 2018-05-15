const 
    mongoose = require('mongoose'),
    config = require('./configs'),
    ModelFactory = require('./lib/model-factory'),
    ApiRoot = require('./models/apiroot'),
    Collection = require('./models/collection'),
    Role = require('./models/role'),
    Account = require('./models/account'),
    fs = require('fs'),
    util = require('util');

const readFile = util.promisify(fs.readFile);
 
// @TODO - need to make sure seeding only happens if taxii2config db doesn't exist

const seedTaxiiData = async () => {

    let seedDir =  __dirname + '/seed-data/';

    let basicJsonInsert = async function(fileName, BaseModel, additionalFields = null) {
        let filePath = seedDir + fileName;

        try {
            let importData = await readFile(filePath, {encoding: 'utf8'});
            let importJson = JSON.parse(importData);

            let insertData = [];
            // get rid of this hack, quick & dirty to get data in
            if(additionalFields) {
                insertData.push(Object.assign(additionalFields, importJson[0]));
            } else {
                insertData = importJson;
            }

            console.log("Importing from: ", fileName);
            
            let objectResult = await BaseModel.insertMany(insertData);
        } catch(err) {
            console.log(err);
        }    
    }

    let importEnterpriseAttack = async function(apiRootName, collectionId) { 
        let file = __dirname + '/seed-data/enterprise-attack.json';

        try {
            let importData = await readFile(file, {encoding: 'utf8'});
            let importJson = JSON.parse(importData);
            //console.log('Import Data Example: ', importJson[1]);
            let models = ModelFactory(apiRootName, collectionId);
            console.log("Seeding Enterprise Attack Collection to API root: ", apiRootName, " collection: ", collectionId);
            console.log(" ... from: ", file);
            
            let objectResult = await models.object.insertMany(importJson);
            //console.log("Import result: ", objectResult);
        } catch(err) {
            console.log(err);
        }    
    }

    let foundSeedData = false;
    try {
        let seededAdminRole = await Role.findOne({name: "Admin"});
        if(seededAdminRole._id) {
            foundSeedData = true
        }
    } catch(err) {
        console.log("No seeded admin role data found, seeding all data.");
    }

    // Execute imports here
    if(!foundSeedData)
    {
        try {
            console.log("Seeding API Root... ");
            await basicJsonInsert('seed-apiroot1.json', ApiRoot);

            let insertedApiRoot = await ApiRoot.findOne({name: "apiroot1"}).select('_id name');
            let insertedApiRootId = { apiRoot : insertedApiRoot._id };
            let insertedApiRootName = insertedApiRoot.name;
            console.log("Seeding Collection... ");
            await basicJsonInsert('seed-collection.json', Collection, insertedApiRootId);

            console.log("Seeding Roles... ");
            await basicJsonInsert('seed-roles.json', Role);

            console.log("Seeding Admin Account... ");
            let insertedAdminRole = await Role.findOne({name: "Admin"});
            let insertedAdminRoleId = { role: insertedAdminRole._id };
            await basicJsonInsert('seed-admin-account.json', Account, insertedAdminRoleId);

            await importEnterpriseAttack(insertedApiRootName, '9ee8a9b3-da1b-45d1-9cf6-8141f7039f82');
        }
        catch(err) {
            console.log("Error: ", err);
        }
    }
}

module.exports = seedTaxiiData;
