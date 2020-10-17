// jshint esversion : 6
const mongoose = require('mongoose');


const RentSchema = new mongoose.Schema({
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
    cost : {
      type : Number,
      required : true
    },
    cashback : {
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
    rentStart : {
      type : Date,
      default : Date.now
    },
    rentExpire : {
      type : Date,
      default: new Date(+new Date() + 30*24*60*60*1000)
    }
});


const Rent = mongoose.model('Rent',RentSchema);

module.exports = Rent;
