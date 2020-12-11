const express = require('express');
const router = express.Router();

const Property = require('../models/Property');
const {veryToken} = require('../utils/auth');

/*
    C.R.U.D.
    C = CREATE
    R = READ
    U = UPDATE (EDIT)
    D = DELETE
*/

//app.user('/api/property')
//localhost:3000/api/property

//Dynamic filter
router.post('/', veryToken, (req, res, next) => { //Rout to create
    //Get id from logged in user
    const {_id: _owner} = req.user;
    //              ({title, address, description, ...})
    Property.create({... req.body, _owner}).then((property) => {
        res.status(201).json({result: property});
    }).catch((error) => {
        res.status(400).json({msg: 'Something went wrong', error});
    });
});

//GET property page.
router.get('/', veryToken, (req, res, next) => { //Route to read
    Property.find(req.query) //req.query = {key: 'value'}
        .populate("_owner","email name profile_picture")
        .then((properties) => {
            res.status(200).json({result: properties});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

//By id
/* router.get('/:id', veryToken, (req, res, next) => { //Route to read
    //:id = '3265twenm3436tn34tn'
    //req.params = {id: '3265twenm3436tn34tn'}
    const {id} = req.params;

    Property.findById(id)
        .populate("_owner","email name profile_picture")
        .then((property) => {
            res.status(200).json({result: property});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
}); */

router.patch('/:id', veryToken, (req, res, next) => { //Route to update
    const {id} = req.params;

    Property.findByIdAndUpdate(id, req.body, {new: true})
        .populate("_owner","email name profile_picture")
        .then((property) => {
            res.status(200).json({result: property});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

router.delete('/:id', veryToken, (req, res, next) => { //Route to delete
    const {id} = req.params;

    Property.findByIdAndRemove(id)
        .then((property) => {
            res.status(200).json({msg: 'Property deleted'});
        })
        .catch((error) => {
            res.status(400).json({msg: 'Something went wrong', error});
        });
});

module.exports = router;