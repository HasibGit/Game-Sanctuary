// jshint esversion : 6
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {
  ensureAuthenticated
} = require('../config/auth.js');

const Product = require('../models/Product.js');



// Home Page
// router.get('/', function(req, res) {
//   Product.find({}, function(err, result) {
//     res.render('home', {
//       req: req,
//       products: result
//     });
//   });
// });

router.get('/',function(req,res){
     Product.find({},function(err,result){
          let numberOfProducts = result.length;
          let limit = 12;
          let numberOfPages = Math.ceil(numberOfProducts / limit);
          let page;
          if(!req.params){
            page = 1;
          }else if(!req.params.page){
            page = 1;
          }else{
            if( parseInt(req.params.page) < 1){
              page = 1;
            }else if(parseInt(req.params.page) > numberOfPages){
              page = numberOfPages;
            }else{
              page = parseInt(req.params.page);
            }
          }

          let start = (page - 1) * limit;

          let products = result.slice(start, start+limit);
          res.render('home', {products : products, req : req, numberOfPages : numberOfPages, page : page});
     });
});

router.get('/policy', function(req,res){
   res.render('policy.ejs', {req : req});
});

router.get('/methods', function(req,res){
   res.render('methods.ejs', {req : req});
});


router.get('/:page',function(req,res){
     Product.find({},function(err,result){

          let numberOfProducts = result.length;
          let limit = 12;
          let numberOfPages = Math.ceil(numberOfProducts / limit);
          let page;
          if(!req.params){
            page = 1;
          }else if(!req.params.page){
            page = 1;
          }else{
            if( parseInt(req.params.page) < 1){
              page = 1;
            }else if(parseInt(req.params.page) > numberOfPages){
              page = numberOfPages;
            }else{
              page = parseInt(req.params.page);
            }
          }

          let start = (page - 1) * limit;

          let products = result.slice(start, start+limit);
          res.render('home', {products : products, req : req, numberOfPages : numberOfPages, page : page});
     });
});







// Get products based on platform
router.get('/platform/:platform', function(req, res) {
  Product.find({
    platform: {
      "$in": [req.params.platform]
    }
  }, function(err, result) {
    res.render('home2', {
      req: req,
      products: result
    });
  });
});

// GEt products based on Genre
router.get('/genre/:genre', function(req, res) {
  Product.find({
    genre: {
      "$in": [req.params.genre]
    }
  }, function(err, result) {
    res.render('home2', {
      req: req,
      products: result
    });
  });
});

// sort based on Rating
router.get('/sort/Rating',function(req,res){
     Product.find({}).sort({rating : "desc"}).exec(function(err,result){
       res.render('home2', {
         req: req,
         products: result
       });
     });
});

// sort based on Price
router.get('/sort/Price',function(req,res){
     Product.find({}).sort({price : "asc"}).exec(function(err,result){
       res.render('home2', {
         req: req,
         products: result
       });
     });
});


function findMatches(wordToMatch, cities){
  return cities.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');   //  gi - global case insensitive
    return place.match(regex);
  });
}



// search query
router.post('/search',function(req,res){
     var title = req.body.search;
     title = _.startCase(title);

     // Product.find({title : title},function(err,result){
     //   res.render('home2', {
     //     req: req,
     //     products: result
     //   });
     // });

     let matchedProducts = [];
     Product.find({}, function(err,result){
         const titles = result.map(product => product.title);
         matchedProducts = findMatches(title,titles);

         // let matches = [];
         // matchedProducts.forEach(title, function(err,result){
         //   matches.push({'title' : result.title});
         // });
         //
         // console.log(matches);

        let products = [];

        for(let i = 0;i < result.length;i++){
          for(let j = 0;j < matchedProducts.length; j++){
            if(result[i].title === matchedProducts[j]){
              products.push(result[i]);
            }
          }
        }

        res.render('home2', {
             req: req,
             products: products
        });
     });

});



// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
  name: req.user.name
}));

module.exports = router;
