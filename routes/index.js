var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Url = mongoose.model("Url");

function goodUrl(url) {
  return url.substring(0, 4) === "www.";
};

function formatUrl(url) {
  if (url.substring(0,4) === "www.") {
    return "http://" + url;
  } else {
    return url;
  }
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/:link", function(req, res, next) {
  var input = req.params.link;
  Url.find({short_url: input}, function(err, doc) {
    if(doc[0] && doc[0].short_url) {
      console.log("Going to :" + doc[0].original_url );
      console.log(doc[0].original_url);
      res.redirect(doc[0].original_url);
    
    } else if ( !goodUrl(input) ) {
      res.send({"error": "bad url"});
    
    } else {
      Url.find(function(err, doc) {

        var url = new Url({
          original_url: formatUrl(input),
          short_url: doc.length +1
        });

        url.save(function(err, doc) {
        res.send(doc);
      });
      });
    }
  });
});

module.exports = router;
