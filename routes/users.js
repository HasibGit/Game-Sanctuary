// jshint esversion : 6
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


const {
  ensureAuthenticated
} = require('../config/auth.js');


// User Model
const User = require('../models/User.js');

// Login PAGE
router.get('/login', (req, res) => res.render('login'));

// Register PAGE
router.get('/register', (req, res) => res.render('register'));





// Register Handle
router.post('/register', (req, res) => {
  const {
    name,
    email,
    address,
    mobileNo,
    password,
    password2
  } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !address || !mobileNo || !password || !password2) {
    errors.push({
      msg: 'Please fill in all fields'
    });
  }

  // Check password match
  if (password !== password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({
      msg: 'Password should be atleast 6 characters long'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      address,
      mobileNo,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({
        email: email
      })
      .then(user => {
        if (user) {
          // User exists
          errors.push({
            msg: 'Email is already registered.'
          });
          res.render('register', {
            errors,
            name,
            email,
            address,
            mobileNo,
            password,
            password2
          });
        } else {
          const newUser = new User({
            // es6 shorthadn style
            name,
            email,
            address,
            mobileNo,
            password
          });

          // Hash Passwords
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to Hash
              newUser.password = hash;
              // Save user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            })
          );
        }
      });
  }
});

// Login Handle

router.post('/login', (req, res, next) => {
      passport.authenticate('local', {
           successRedirect: '/',
           failureRedirect:  '/users/login',
           failureFlash: true
      })(req,res,next);
});

// edit Profile

router.get('/editProfile', ensureAuthenticated, (req,res) => {
  res.render('editProfile', {req : req});
});

router.post('/editProfile', ensureAuthenticated, (req,res) => {
    const {
      name,
      address,
      mobileNo
    } = req.body;

    User.updateOne({_id: req.user._id}, {name: name, address: address, mobileNo: mobileNo},function(err){
           if(err){
             console.log(err);
           }else{
             req.flash('success_msg','Your profile has been updated successfully.');
             res.redirect('/');
           }
    });

});



// Logout Handle

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
