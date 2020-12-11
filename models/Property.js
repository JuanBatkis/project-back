//const mongoose = require('mongoose');

//Schema = Schema
//const {Schema} = mongoose;

const {Schema, model} = require('mongoose');

const propertySchema = new Schema(
    {
        _owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'The property requires an owner'],
        },
        title: {
            type: String,
            required: [true, 'The property requires a title'],
        },
        address: {
            type: String,
            required: [true, 'The property requires an address'],
        },
        description: {
            type: String,
            minlength: [50, 'Description is too short'],
        },
        images: {
            type: [String],
            minlength: [1, 'Must upload at least one image'],
        },
        price: {
            type: Number,
            min: [1, 'The price must be at least 1'],
            required: [true, 'The property requires a price'],
        },
        capacity: {
            type: Number,
            required: [true, 'The property requires a capacity'],
        },
    },
    {
        timestamps: true
    }
);

//module.exports = mongoose.model('Property', propertySchema);

module.exports = model('Property', propertySchema);