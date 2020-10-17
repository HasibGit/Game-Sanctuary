// jshint esversion : 6
const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    title : {
      type : String,
      required : true
    },
    background_img_src : {
      type : String,
      required : true
    },
    cover_img_src : {
      type : String,
      required : true
    },
    release_date : {
      type : String,
      required : true
    },
    genre : {
      type : Array,
      default : []
    },
    platform : {
      type : Array,
      default : []
    },
    rating : {
      type : Number,
      required : true
    },
    description : {
      type : String,
      required : true
    },
    screenShot_1 : {
      type : String,
      required : true
    },
    screenShot_2 : {
      type : String,
      required : true
    },
    screenShot_3 : {
      type : String,
      required : true
    },
    price : {
      type : Number,
      required : true
    },
    rental_price : {
      type : Number,
      default : 800
    },
    date : {
      type : Date,
      default : Date.now
    }
});


const Product = mongoose.model('Product',ProductSchema);

module.exports = Product;
