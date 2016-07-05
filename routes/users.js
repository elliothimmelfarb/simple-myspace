'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.route('/')
  .get((req, res) => {
    User.find({}, (err, users) => {
      res.status(err ? 400 : 200).send(err || users);
    }).select('-password') // TODO: add select for -password
  });

router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, user) => {
    if(err) return res.status(400).send(err);
    let token = user.generateToken;
    res.cookie('authtoken', token).send(user);
  });
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

module.exports = router;
