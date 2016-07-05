'use strict';

const JWT_SECRET = process.env.JWT_SECRET;

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  profile: {
    name: {type: String},
    age: {type: Number},
    favColor: {type: String}
  }
});

userSchema.statics.register = function(userObj, cb) {
  User.findOne({username: userObj.username}, (err, user) => {
    if(err || user) return cb(err || {error: 'Username already taken'});

    bcrypt.hash(userObj.password, 12, (err, hash) => {
      userObj.password = hash;
      User.create(userObj, err => {
        cb(err);
      });
    });
  });
};

let User = mongoose.model('User', userSchema);
module.exports = User;
