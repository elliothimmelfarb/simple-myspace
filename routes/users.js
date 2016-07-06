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

router.get('/profile', User.authMiddleware, (req, res) => {
  res.send(req.user);
})

router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, user) => {
    if(err) return res.status(400).send(err);
    let token = user.generateToken();
    res.cookie('authtoken', token).send(user);
  });
});

router.post('/:id/postMsg', (req, res) => {
  User.postMessage(req.params.id, req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    user.password = null;
    res.status(err ? 400 : 200).send(err || user);
  });
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

module.exports = router;
