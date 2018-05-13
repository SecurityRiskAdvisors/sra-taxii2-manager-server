const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

// @TODO - this code is literally cut and pasted for use in the CLI import tool, need to figure out something better
// npm module maybe

const objectSchema = new Schema({ 
    any: {} 
}, { 
    id: false, 
    timestamps: true,
    strict: false
});

objectSchema.plugin(mongoosePaginate);

module.exports = objectSchema;