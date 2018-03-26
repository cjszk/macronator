const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Measurement = require('../models/Measurements.model');

router.get('/measurements', (req, res, next) => {

    Measurement.find()
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            next(error);
        })
})

router.get('/measurements/:id', (req, res, next) => {

    const { id } = req.params;

    Measurement.findById(id)
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            next(error)
        })
})

router.post('/measurements', (req, res, next) => {

    const { shoulders, chest, waistAbove, waist, waistBelow, hips, quads} = req.body

    const newMeasurements = {
        shoulders: shoulders,
        chest: chest,
        waistAbove: waistAbove,
        waist: waist,
        waistBelow: waistBelow,
        hips: hips,
        quads: quads
    }

    Measurement.create(newMeasurements)
        .then((result) => {
            res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
        })
        .catch((error) => {
            next(error);
        })

})

router.put('/measurements/:id', (req, res, next) => {

    const { id } = req.params;
    const { shoulders, chest, waistAbove, waist, waistBelow, hips, quads} = req.body

    const newMeasurements = {
        shoulders: shoulders,
        chest: chest,
        waistAbove: waistAbove,
        waist: waist,
        waistBelow: waistBelow,
        hips: hips,
        quads: quads
    }

    const options = {new: true}

    Measurement.findByIdAndUpdate(id, newMeasurements, options)
        .then((result) => {
            if (result) {
                res.json(result);
            }
        })
        .catch((error) => {
            next(error);
        })
})

router.delete('/measurements/:id', (req, res, next) => {
    
    const { id } = req.params;

    Measurement.findByIdAndRemove(id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => {
            next(error);
        })

})

module.exports = router;