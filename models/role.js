const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let RoleSchema = new Schema({
    name: { type: String, required: true },
    readAll: { type: Boolean },
    writeAll: { type: Boolean },
    // @TODO - not implemented deeper permissions
    // @TODO - make these strings and reference name rather than Object ID
    readApiRoots: [{type: Schema.Types.ObjectId, ref: 'ApiRoot'}],
    writeApiRoots: [{type: Schema.Types.ObjectId, ref: 'ApiRoot'}],
    readCollections: [{type: String, ref: 'Collection'}],
    writeCollections: [{type: String, ref: 'Collection'}],
    system: { type: Boolean }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);