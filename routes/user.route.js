const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User.model');
const Data = require('../models/Data.model')
const Measurement = require('../models/Measurements.model')

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
    console.log(`id is :` +id);

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
        password: password
    }

    User.create(newUser)
        .populate('data')
        //Deep populate measurements
        .populate({
            path: 'data',
            populate: { path: 'measurements'}
        })
        .then((result) => {
            res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.put('/users/:id', (req, res, next) => {
    const { id } = req.params;
    const { username, password, data, goal } = req.body;

    const newUser = {
        username: username,
        password: password,
        data: data,
        goal: goal
    }

    console.log(newUser);

    const options = { new: true }

    User.findByIdAndUpdate(id, newUser, options)
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