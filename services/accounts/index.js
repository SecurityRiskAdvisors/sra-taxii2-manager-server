'use strict';
const mongoose = require('mongoose');
const Account = require('../../models/account');
const { check, validationResult } = require('express-validator/check');

const mockResponse = [{
        "title": "Malware Research Group",
        "description": "A trust group setup for malware researchers",
        "versions": ["taxii-2.0"],
        "max_content_length": 9765625
       }];


// @TODO - paginate https://github.com/expressjs/express-paginate
const getAccounts = async (req, res, next) => {
    try {
        let accountsResult = await Account.find({}).select('_id name email role createdAt');

        res.data = accountsResult;
        next();
    } 
    catch (err) {
        console.log(err);
        // @TODO - probably don't want to send the whole thing?
        return res.status(500).send(err);
    }
}

const getAccountById = async (req, res, next) => {
    let id = req.params.accountId || 0;

    try {
        let accountResult = await Account.findById(id).select('_id name email role createdAt');
        res.data = accountResult;
        next();
    } 
    catch (err) {
        console.log(err);
        // @TODO - probably don't want to send the whole thing?
        return res.status(500).send(err);
    }
}

// @TODO - https://www.npmjs.com/package/express-brute add brute force protection
const createAccount = [
    check('email').isEmail().withMessage('must be a valid email'),
    async (req, res, next) => {
        try {
            let accountData = {
                email: req.body.email,
                name: req.body.name,
                // role: { type: String, required: true },
                password: req.body.password,
                active: req.body.active
            }

            let newAccount = new Account(accountData);
            let result = await newAccount.save();
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
    getAccounts: getAccounts,
    getAccountById: getAccountById,
    createAccount: createAccount
};
