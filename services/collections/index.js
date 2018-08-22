'use strict';
const mongoose = require('mongoose');
const Collection = require('../../models/collection');
const ApiRoot = require('../../models/apiroot');
const { check, validationResult } = require('express-validator/check');
const config = require('../../configs');

const getCollections = async (req, res, next) => {
    try {
        let collectionsResult = await Collection.find({}).select('_id id title description media_types createdAt');

        res.data = collectionsResult;
        next();
    } 
    catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

const getCollectionByTitle = async (req, res, next) => {
    try {
        console.log("title:"+ req.params.title);
        let collectionResult = await Collection.find({title: req.params.title}).select('_id id title description media_types createdAt');

        res.data = collectionResult;
        next();
    } 
    catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

const createCollection = [
    check('title', 'Must be unique and between 3 and 255 characters in length')
        .isString()
        .isLength({min:3,max:255})
        .custom((value, { req }) => {
            return Collection.find({title: value}).select('_id').then((colRes) => {
                return Promise.resolve(colRes.length == 0);
            })
        }),
    // objectID
    check('apiRoot', 'Must exist and be between 10 and 255 chars in length')
        .isString()
        .isLength({min:10,max:255})
        .custom((value, { req }) => {
            return ApiRoot.findById(value).select('_id').then((apiRootRes) => {
                return Promise.resolve(apiRootRes._id != null && typeof(apiRootRes._id) != 'undefined');
            })
        }),
    // @TODO - validation for media_types
    async (req, res, next) => {
        try {
            // @TODO - generalize this too, maybe throw error?
            const errors = validationResult(req); 
            if (!errors.isEmpty()) {
                console.log(errors.mapped());
                return res.status(422).json({ errors: errors.mapped() });
            }
            let newCollectionData = {
                title: req.body.title,
                description: req.body.description ? req.body.description : "",
                // Note this is how reference is inserted in new mongo objects being generated for mongoose
                apiRoot: mongoose.Types.ObjectId(req.body.apiRoot),
                media_types: req.body.media_types
            }

            let newCollection = new Collection(newCollectionData); 
            let result = await newCollection.save();
 
            let apiRootRes = await ApiRoot.findById(req.body.apiRoot).select('_id name');
            let serverDbConn = await mongoose.createConnection(config.connectionString + apiRootRes.name);
            serverDbConn.createCollection(result.id);

            res.data = result;
        } 
        catch (err) {
            console.log(err);
            // @TODO - probably don't want to send the whole thing?
            return res.status(500).send(err);
        }
    }
]


module.exports = {
    getCollections: getCollections,
    getCollectionByTitle: getCollectionByTitle,
    createCollection: createCollection
};
