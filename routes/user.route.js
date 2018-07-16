const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Data = require('../models/Data.model');
const Measurement = require('../models/Measurements.model');

router.get('/users', (req, res, next) => {
    User.find()
        .populate('data')
        //Deep populate measurements
        .populate({
            path: 'data',
            populate: { path: 'measurements'}
        })
        .sort('data')
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.get('/users/:id', (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .populate('data')
        //Deep populate measurements
        .populate({
            path: 'data',
            populate: { path: 'measurements'}
        })
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.post('/users', (req, res, next) => {
    const { username, password } = req.body;

    const newUser = {
        username: username,
        password: password,
    }

    // User.create(newUser)
    //     .then((result) => {
    //         res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    //     })
    //     .catch((error) => {
    //         next(error);
    //     })

    User.find()
    .then((results) => {
        let check = false;
        results.forEach((user) => {
            if (user.username === username) {
                check = true;
            }
        })
        if (check === true) {
            const err = new Error('That username already exists!');
            err.status = 400;
            return next(err);
        } else {

            return User.hashPassword(password)
                .then(digest => {
                    const newUser = {
                        data: [],
                        goal: "Maintain",
                        username: username,
                        password: digest
                    }
                    User.create(newUser)
                        .then((result) => {
                            console.log(newUser);
                            res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
                        })
                        .catch((err) => next(err));
                })
        }
    })
})

router.put('/change-goal/:id', (req, res, next) => {
    const { id } = req.params;
    const { goal } = req.body;

    User.findById(id)
        .then((result) => {
            newUser = result;
            newUser.goal = goal;
        })
        .then(() => {
            User.findByIdAndUpdate(id, newUser)
            .populate('data')
            //Deep populate measurements
            .populate({
                path: 'data',
                populate: { path: 'measurements'}
            })
            .then((result) => {
                if (result) {
                    res.json(result);
                }
            })
            .catch((error) => {
                next(error);
            })
        })
        .catch(error => next(error))


});

router.put('/change-password/:id', (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;

    let newPassword;
    let newUser = {}

    return User.hashPassword(password)
    .then(digest => {
        newPassword = digest;
        User.findById(id)
            .then((result) => {
                newUser = result;
                newUser.password = newPassword;
            })
            .then((result) => {
                User.findByIdAndUpdate(id, newUser)
                .populate('data')
                //Deep populate measurements
                .populate({
                    path: 'data',
                    populate: { path: 'measurements'}
                })
                .then((result) => {
                    if (result) {
                        res.json(result);
                    }
                })
                .catch((error) => {
                    next(error);
                })
            })
            .catch((err) => next(err))
    })
});

router.delete('/users/:id', (req, res, next) => {
    const { id } = req.params;

    User.findByIdAndRemove(id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => {
            next(error);
        })
})




module.exports = router;