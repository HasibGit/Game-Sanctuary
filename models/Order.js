// jshint esversion : 6
const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    customer_name : {
      type : String,
      required : true
    },
    customer_email : {
      type : String,
      required : true
    },
    customer_address : {
      type : String,
      required : true
    },
    product_name : {
      type : String,
      required : true
    },
    order_type : {
      type : String,
      required : true
    },
    price : {
      type : Number,
      required : true
    },
    payment_method : {
      type : String,
      required : true
    },
    transaction_id : {
      type : String,
      default : ''
    },
    mail_sent : {
      type : Boolean,
      default : false
    },
    date : {
      type : Date,
      default : Date.now
    }
});


const Order = mongoose.model('Order',OrderSchema);

module.exports = Order;
