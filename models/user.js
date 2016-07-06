'use strict';

const JWT_SECRET = process.env.JWT_SECRET;

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let messageSchema = new mongoose.Schema({
  createdAt: {type: Date, default: Date.now},
  poster: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  content: {type: String}
});

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: {type: Date, default: Date.now},
  profile: {
    messages: [messageSchema],
    name: {type: String},
    age: {type: Number},
    favColor: {type: String},
    avatar: {type: String}
  }
});

userSchema.statics.authMiddleware = function(req, res, next) {
  let token = req.cookies.authtoken;
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send(err);
    User.findById(payload._id, (err, user) => {
      if(err || !user) return res.status(401).send(err || {error: 'User not found.'})
      req.user = user;
      next();  
    })
  }).select('-password');
};

userSchema.statics.postMessage = function(userId, msgObj, cb) {
  User.findById(userId, (err, user) => {
    if(err || !user) return cb(err || {error: 'User not found.'});
    let message = {
      content: msgObj.content,
      poster: msgObj.poster
    }
    user.profile.messages.push(message);
    user.save(err => {
      cb(err);
    });
  });
}

userSchema.methods.generateToken = function() {
  let payload = {
    _id: this.id,
    username: this.username
  };

  let token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1 day'});
  return token;
};

userSchema.statics.authenticate = function(userObj, cb) {
  User.findOne({username: userObj.username}, (err, user) => {
    if(err || !user) return cb(err || {error: 'Invalid username or password'});
    bcrypt.compare(userObj.password, user.password, (err, isGood) => {
      if(err || !isGood) return cb(err || {error: 'Invalid username or password'});
      user.password = null;
      cb(null, user);
    });
  });
};

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
