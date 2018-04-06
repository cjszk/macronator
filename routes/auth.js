const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('../passport/local');
const User = require('../models/User.model');

const localAuth = passport.authenticate('local', {session: false, failWithError: true});

router.post('/login', localAuth, function (req, res, next) {
    res.json(req.user);
})

module.exports = router;