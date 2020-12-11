//This will help us verify is an user and token exists

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.veryToken = (req, res, next) => {
    const { token } = req.cookies;

    //We use verify to see if a token exists
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) return res.status(401).json({error});

        User.findById(decoded.id).then((user) => {
            //We save the user in req.user, so we can use it anywhere
            req.user = user;

            //Next means it can literaly continue
            next();
        });
    })
};

//Middelware to check roles and utils to clean responses from trash data
exports.checkRole = (roles) => {
    return (req, res, next) => {
        const {role} = req.user;
        if (roles.includes(role)) {
            return next();
        } else {
            return res.status(403).json({msg: `You don't have permission to perform this acction`});
        }
    }
}

exports.clearRes = (data) => {
    //We deconstruct the data object and return a new object with only the required fields
    const {password, __v, createdAt, updatedAt, ...cleanedData} = data;
    return cleanedData;
}