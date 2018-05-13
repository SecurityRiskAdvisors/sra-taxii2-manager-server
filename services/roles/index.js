'use strict';
const mongoose = require('mongoose');
const Role = require('../../models/role');

const getRoles = async (req, res, next) => {
    try {
        let roleResult = await Role.find({});

        res.data = roleResult;
        next();
    } 
    catch (err) {
        console.log(err);
        // @TODO - probably don't want to send the whole thing?
        // @TODO - generalize error handler
        return res.status(500).send(err);
    }
}


module.exports = {
    getRoles: getRoles
};
