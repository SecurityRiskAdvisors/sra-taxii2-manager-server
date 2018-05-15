'use strict';
const Account = require('../../models/account');
const Role = require('../../models/role');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

const baseLogin = async (req, res, next) => {
    try {
        let email = req.body.email,
            password = req.body.password;
            
        let accountResult = await Account.findOne({email: email}).populate('role');

        // @TODO - @GFTODO - testing speed of auth
        if(await bcrypt.compare(password, accountResult.password) && accountResult.active && accountResult.role) {
              // @TODO - not implemented yet for API roots since the URL has NAME rather than an ID.
            // UNLESS we change apiroot reference in account to lookup via name with unique key?
            /* 
                if(accountResult.role.readApiRoots || accountResult.role.writeApiRoots) {
                    // populate role.read and write API roots with api root name
                }
            */

            if(accountResult) {
                res.data = accountResult.role;
                return next();
            }
            return next();
        }

        return res.status(401).send("Login failure");
        
        next();
    } 
    catch (err) {
        console.log(err);
        // @TODO - probably don't want to send the whole thing?
        return res.status(401).send("Login failure");
    }
}

const login = [
    check('email').isEmail().withMessage('must be a valid email'),
    check('password').isLength({ min: 5 }),
    baseLogin
]


module.exports = {
    login: login
};
