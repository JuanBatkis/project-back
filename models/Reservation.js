const {Schema, model} = require('mongoose');

const reservationSchema = new Schema(
    {
        _property: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        _guest: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        checkin: {
            type: Date,
            required: [true, 'Must set a checkin date'],
        },
        checkout: {
            type: Date,
            required: [true, 'Must set a checkout date'],
        },
        guest_number: {
            type: Number,
            min: [1,'Min guest number is 1']
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Reservation', reservationSchema);