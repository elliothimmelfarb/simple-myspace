'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.route('/')
  .get((req, res) => {
    User.find({}, (err, users) => {
      res.status(err ? 400 : 200).send(err || users);
    }) // TODO: add select for -password
  })

router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  })
})

module.exports = router;
