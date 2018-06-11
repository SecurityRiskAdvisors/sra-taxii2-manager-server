'use strict';
const mongoose = require('mongoose');
const Collection = require('../../models/collection');
const { check, validationResult } = require('express-validator/check');
const config = require('../../configs');

const getCollections = async (req, res, next) => {
    try {
        let collectionsResult = await Collection.find({}).select('_id id title description createdAt');

        res.data = collectionsResult;
        next();
    } 
    catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}


module.exports = {
    getCollections: getCollections
};
