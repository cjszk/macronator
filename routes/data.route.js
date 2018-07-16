const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User.model')
const Data = require('../models/Data.model');
const Measurement = require('../models/Measurements.model');

router.get('/data', (req, res, next) => {
    Data.find()
        .sort('-date')
        .populate('measurements')
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.get('/data/:id', (req, res, next) => {
    const { id } = req.params
    
    Data.findById(id)
        .populate('measurements')
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.post('/data', (req, res, next) => {
    // const { weight, calories, measurements, date} = req.body;
    const { userId } = req.body;
    const { weight, calories, date} = req.body;

    const newData = {
        date: date,
        weight: weight,
        calories: calories,
        measurements: null
    }

    // if (!mongoose.Types.ObjectId.isValid(measurements)) {
    //     const err = new Error('The `id` provided for measurements is not valid');
    //     err.status = 400;
    //     return next(err);
    // }

    Data.create(newData)
        .then((result) => {
            const dataId = result.id
            console.log(dataId)
            User.findById(userId)
                .then((result) => {
                    let newUserData = result;
                    console.log(newUserData)
                    newUserData.data.push(dataId)
                    User.findByIdAndUpdate(userId, newUserData)
                        .then((result) => {
                            res.json(result)
                        })
                        .catch(err => next(err))
                })
                .catch(err => next(err))

        })
        .catch((error) => {
            next(error);
        })
})

router.put('/data/:id', (req, res, next) => {
    const { id } = req.params;
    const { weight, calories, measurements, date } = req.body;
    const newData = {
        date: date,
        weight: weight,
        calories: calories,
        measurements: measurements
    }

    const options = {new: true};

    Data.findByIdAndUpdate(id, newData, options)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.delete('/data/:id', (req, res, next) => {
    const { id } = req.params;

    Data.findByIdAndRemove(id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => {
            next(error);
        })
})

module.exports = router;