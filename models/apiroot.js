const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ApiRootSchema = new Schema({
    name: { type: String, lowercase: true, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('ApiRoot', ApiRootSchema);