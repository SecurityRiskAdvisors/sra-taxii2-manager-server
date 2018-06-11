const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const objectSchema = new Schema({ 
    any: {} 
}, { 
    id: false, 
    timestamps: true,
    strict: false
});

objectSchema.index({id: 1, created: 1}, {unique: true});
objectSchema.plugin(mongoosePaginate);

module.exports = objectSchema;