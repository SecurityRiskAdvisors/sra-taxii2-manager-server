'use strict';
const mongoose = require('mongoose');
const ApiRoot = require('../../models/apiroot');
const { check, validationResult } = require('express-validator/check');
const config = require('../../configs');

const getApiRoots = async (req, res, next) => {
    try {
        let apiRootsResult = await ApiRoot.find({}).select('_id name baseUrl createdAt');

        res.data = apiRootsResult;
        next();
    } 
    catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

// @TODO - @GFTODO - complete this
const getApiRootByName = async (req, res, next) => {
    try {
        let apiRootsResult = await ApiRoot.find({}).select('_id name baseUrl createdAt');

        res.data = apiRootsResult;
        next();
    } 
    catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

// https://github.com/ctavan/node-validator
// @TODO - @GFTODO - make this validate 3-64 chars alphanumeric URL valid chars maybe - or _
const createApiRoot = [
    check('name')
        .custom(value => {
            if(value.toLowerCase() == config.confDb)
            {
                throw new Error('API Root can not match taxii configuration.');
            }
            return 1;
        })
        .matches(/^[A-Za-z0-9][A-Za-z0-9\-]+[A-Za-z0-9]$/)
        .isLength({min:3,max:64}),
    async (req, res, next) => {
        try {
            // @TODO - generalize this too, maybe throw error?
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.mapped() });
            }
            let apiRootData = {
                name: req.body.name,
                baseUrl: req.body.baseUrl
            }

            //let newApiRoot = new ApiRoot(newApiRoot);
            //let result = await newApiRoot.save();
            let result = {"party": "time"}
            res.send(result);
        } 
        catch (err) {
            console.log(err);
            // @TODO - probably don't want to send the whole thing?
            return res.status(500).send(err);
        }
    }
]

module.exports = {
    getApiRoots: getApiRoots,
    createApiRoot: createApiRoot
};
