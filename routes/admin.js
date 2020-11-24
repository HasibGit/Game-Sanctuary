// jshint esversion : 6
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const router = express.Router();
const {
  ensureAuthenticated
} = require('../config/auth.js');


// Product Model
const Product = require('../models/Product.js');

// Product Model
const Order = require('../models/Order.js');

// Rent Model
const Rent = require('../models/Rent.js');


let transporter = nodemailer.createTransport({
     service : 'gmail',
     auth : {
       user : process.env.EMAIL,
       pass : process.env.PASSWORD
     }
});




// Admin Crud
router.get('/adminPanal', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    res.render('admin',{req: req});
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }
});

router.get('/addProduct', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    res.render('addProduct');
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }
});


router.get('/orders', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    Order.find({}, function(err, orders) {
      if (err) {
        console.log(err);
      } else {
        res.render('orders_admin.ejs', {
          orders: orders
        });
      }
    });
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }
});

router.get('/rentList', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    Rent.find({}, function(err, rents) {
      if (err) {
        console.log(err);
      } else {
        res.render('rents_admin.ejs', {
          rents: rents
        });
      }
    });
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }
});

router.get('/update/:productId', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    Product.findById(req.params.productId, function(err, result) {

      const title = result.title;
      const background_img_src = result.background_img_src;
      const cover_img_src = result.cover_img_src;
      const release_date = result.release_date;
      const genre = result.genre;
      const platform = result.platform;
      const rating = result.rating;
      const description = result.description;
      const screenShot_1 = result.screenShot_1;
      const screenShot_2 = result.screenShot_2;
      const screenShot_3 = result.screenShot_3;
      const price = result.price;

      res.render('updateProduct.ejs', {
        title,
        background_img_src,
        cover_img_src,
        release_date,
        genre,
        platform,
        rating,
        description,
        screenShot_1,
        screenShot_2,
        screenShot_3,
        price
      });

    });
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }

});

router.get('/delete/:productId', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    Product.deleteOne({
      _id: req.params.productId
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        req.flash('success_msg', 'Product has been deleted successfully.');
        res.redirect('/admin/adminPanal');
      }
    });
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }

});

router.post('/addProduct', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    const {
      title,
      background_img_src,
      cover_img_src,
      release_date,
      genre,
      platform,
      rating,
      description,
      screenShot_1,
      screenShot_2,
      screenShot_3,
      price
    } = req.body;
    let errors = [];

    // Check required fields
    if (!title || !background_img_src || !cover_img_src || !release_date || !genre || !platform || !rating || !description || !screenShot_1 || !screenShot_2 || !screenShot_3 || !price) {
      errors.push({
        msg: 'Please fill in all fields'
      });
    }

    if (errors.length > 0) {
      res.render('addProduct', {
        errors,
        title,
        background_img_src,
        cover_img_src,
        release_date,
        rating,
        description,
        screenShot_1,
        screenShot_2,
        screenShot_3,
        price
      });
    } else {
      // Check if a product with same title already exists
      Product.findOne({
          title: title
        })
        .then(product => {
          if (product) {
            errors.push({
              msg: 'Product with the same title already exists!'
            });
            res.render('addProduct', {
              errors,
              title,
              background_img_src,
              cover_img_src,
              release_date,
              rating,
              description,
              screenShot_1,
              screenShot_2,
              screenShot_3,
              price
            });
          } else {
            const newProduct = new Product({
              // es6 shorthadn style
              title: req.body.title,
              background_img_src: req.body.background_img_src,
              cover_img_src: req.body.cover_img_src,
              release_date: req.body.release_date,
              genre: req.body.genre,
              platform: req.body.platform,
              rating: parseFloat(req.body.rating),
              description: req.body.description,
              screenShot_1: req.body.screenShot_1,
              screenShot_2: req.body.screenShot_2,
              screenShot_3: req.body.screenShot_3,
              price: parseInt(req.body.price)
            });
            newProduct.save()
              .then(product => {
                req.flash('success_msg', 'New product added successfully');
                res.redirect('/admin/adminPanal');
              })
              .catch(err => console.log(err));

          }
        });
    }
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }
});


router.post('/updateProduct', ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    const {
      title,
      background_img_src,
      cover_img_src,
      release_date,
      genre,
      platform,
      rating,
      description,
      screenShot_1,
      screenShot_2,
      screenShot_3,
      price
    } = req.body;
    let errors = [];

    // Check required fields
    if (!title || !background_img_src || !cover_img_src || !release_date || !genre || !platform || !rating || !description || !screenShot_1 || !screenShot_2 || !screenShot_3 || !price) {
      errors.push({
        msg: 'Please fill in all fields'
      });
    }

    if (errors.length > 0) {
      res.render('updateProduct', {
        errors,
        title,
        background_img_src,
        cover_img_src,
        release_date,
        rating,
        description,
        screenShot_1,
        screenShot_2,
        screenShot_3,
        price
      });
    } else {
      Product.updateOne({
        title: title
      }, {
        title: req.body.title,
        background_img_src: req.body.background_img_src,
        cover_img_src: req.body.cover_img_src,
        release_date: req.body.release_date,
        genre: req.body.genre,
        platform: req.body.platform,
        rating: parseFloat(req.body.rating),
        description: req.body.description,
        screenShot_1: req.body.screenShot_1,
        screenShot_2: req.body.screenShot_2,
        screenShot_3: req.body.screenShot_3,
        price: parseInt(req.body.price)
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          req.flash('success_msg', 'Product has been successfully updated.');
          res.redirect('/admin/adminPanal');
        }
      });
    }
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }
});


router.get('/sendEmail/:orderId', ensureAuthenticated, function(req, res) {
  if (req.user.admin) {
    Order.findById(req.params.orderId, function(err, order) {
      if (err) {
        console.log(err);
      } else {
          let mailOptions = {
            from : 'lostgen312@gmail.com',
            to : order.customer_email,
            subject : 'Order Status',
            text : 'Thanks for buying from GameSanctuary. Your ordered product has been shipped to your address. Hopefully you will recieve your product within a couple of days. If you rented the product, return it within 30 days of recieving to get your cashback.'
          };

          transporter.sendMail(mailOptions, function(err,data){
            if(err){
              console.log(err);
            }else{
              console.log('email sent');
              Order.updateOne({_id : order._id},{mail_sent : true}, function(err){
                if(err){
                  console.log(err);
                }else{
                  req.flash('success_msg', 'Email has been sent successfully');
                  res.redirect('/admin/orders');
                }
              });
            }
          });
      }
    });
  } else {
    req.flash('error_msg', 'You are not eligible view this resource');
    req.logout();
    res.redirect('/users/login');
  }
});


router.get('/remove/:orderId',ensureAuthenticated, function(req,res){
    if(req.user.admin){
      Order.deleteOne({_id : req.params.orderId}, function(err){
        if(err){
          console.log(err);
        }else{
          req.flash('success_msg', 'Order removed successfully.');
          res.redirect('/admin/orders');
        }
      });
    }else{
      req.flash('error_msg', 'You are not eligible view this resource');
      req.logout();
      res.redirect('/users/login');
    }
});


router.get('/removeRent/:rentId',ensureAuthenticated, function(req,res){
    if(req.user.admin){
      Rent.deleteOne({_id : req.params.rentId}, function(err){
        if(err){
          console.log(err);
        }else{
          req.flash('success_msg', 'Rent removed successfully.');
          res.redirect('/admin/rentList');
        }
      });
    }else{
      req.flash('error_msg', 'You are not eligible view this resource');
      req.logout();
      res.redirect('/users/login');
    }
});

router.get('/sendToRent/:orderId',ensureAuthenticated, function(req,res){
     if(req.user.admin){
          Order.findById(req.params.orderId, function(err,order){
                 if(err){
                   console.log(err);
                 }else{
                    const newRent = new Rent({
                      customer_name : order.customer_name,
                      customer_email : order.customer_email,
                      customer_address : order.customer_address,
                      product_name : order.product_name,
                      cost : order.price,
                      cashback : (order.price - ((order.price * 20)/100)),
                      payment_method : order.payment_method,
                      transaction_id : order.transaction_id
                    });
                    newRent.save();
                 }
          });
          Order.deleteOne({_id : req.params.orderId}, function(err){
            if(err){
              console.log(err);
            }else{
              req.flash('success_msg', 'Order has been moved to rent list successfully.');
              res.redirect('/admin/orders');
            }
          });
     }else{
       req.flash('error_msg', 'You are not eligible view this resource');
       req.logout();
       res.redirect('/users/login');
     }
});



module.exports = router;
