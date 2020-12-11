const express = require('express');
const router = express.Router();

const Reservation = require('../models/Reservation');
const {veryToken} = require('../utils/auth');

//Brings all user reservations
router.get('/', veryToken, (req, res, next) => { //Route to read
    const {_id} = req.user;

    Reservation.find({_guest: _id})
        .populate({
            path:"property",
            populate:{
                path:"_owner",
                select: "name",
            },
        })
        .then((reservations) => {
            res.status(200).json({result: reservations});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

//Brings all property reservations
router.get('/property/:property_id', veryToken, (req, res, next) => { //Route to read
    const {property_id} = req.params;

    Reservation.find({_property: property_id})
        .populate("_guest","name")
        .then((reservations) => {
            res.status(200).json({result: reservations});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

router.post('/', veryToken, (req, res, next) => { //Rout to create
    const {_id: _guest} = req.user;
    const reservation = {...req.body, _guest};

    Reservation.create(reservation)
        .then((reservation) => {
            res.status(200).json({result: reservation});
        }).catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

router.patch('/:id', veryToken, (req, res, next) => { //Route to update
    const {id} = req.params;

    Reservation.findByIdAndUpdate(id, req.body, {new: true})
        .then((reservation) => {
            res.status(200).json({result: reservation});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

router.delete('/:id', veryToken, (req, res, next) => { //Route to delete
    const {id} = req.params;
    
    Reservation.findByIdAndDelete(id)
        .then((reservation) => {
            res.status(200).json({msg: 'Reservation deleted'});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

module.exports = router;