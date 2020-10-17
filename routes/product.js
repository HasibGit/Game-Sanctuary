// jshint esversion : 6
const express = require('express');
const router = express.Router();
const {
  ensureAuthenticated
} = require('../config/auth.js');

const Product = require('../models/Product.js');
//Order  Model
const Order = require('../models/Order.js');


router.get('/:productId', function(req, res) {

  var id = req.params.productId;

  Product.findById(id, function(err, product) {
    res.render('product', {
      req: req,
      product: product
    });
  });
});

// buy method
router.get('/:type/:productId', ensureAuthenticated, function(req, res) {
  var id = req.params.productId;

  Product.findById(id, function(err, product) {
    res.render('order', {
      req: req,
      product: product,
      type : req.params.type
    });
  });
});

// confirm Order
router.post('/confirm/:type/:productId',ensureAuthenticated,function(req,res){
  var id = req.params.productId;

  Product.findById(id, function(err, product) {
      const customer_name = req.user.name;
      const customer_email = req.user.email;
      const customer_address = req.body.address;
      const product_name = product.title;
      const order_type = req.params.type;
      var price;
      if(order_type === "buy"){
        price = product.price;
      }else{
        price = product.price;
      }
      const payment_method = req.body.method;
      const transaction_id = req.body.transaction_id;

      const newOrder = new Order({
        customer_name,
        customer_email,
        customer_address,
        product_name,
        order_type,
        price,
        payment_method,
        transaction_id
      });
      newOrder.save();
      req.flash('success_msg','Your order has been submitted successfully. Please check your email for confirmation message.');
      res.redirect('/');
  });
});


module.exports = router;
