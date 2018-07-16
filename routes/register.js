'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  User.find()
    .then((results) => {
      let check = false;
      results.forEach((user) => {
        if (user.username === username) {
          check = true;
        }
      });
      if (check === true) {
        const err = new Error('That username already exists!');
        err.status = 400;
        return next(err);
      } 
      else if (password.length < 5) {
        const err = new Error('Password does not meet minimum length requirement.');
        err.status = 400;
        return next(err);
      }
      else if (username.length < 3) { 
        const err = new Error('Username does not meet minimum length requirement.');  
        err.status = 400;
        return next(err);              
      }
      else {
        return User.hashPassword(password)
          .then(digest => {
            const newUser = {
              username: username,
              password: digest,
              goal: 'Not Selected'
            };
            User.create(newUser)
              .then((result) => {
                res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
              })
              .catch((err) => next(err));
          });
      }
    });
});

module.exports = router;