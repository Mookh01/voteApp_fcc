var express = require("express");
var passport = require("passport");
var config = require('./config.js');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var poll = require("./models/poll.js");
var User = require("./models/user.js");
var Url = require('./models/url.js');
var base58 = require('./base58.js');
var path = require('path');
var router = express.Router();

module.exports = router;




//CHECK EXISTENCE of shortened url
router.post('/api/shorten', function(req, res) {
    // route to create and return a shortened URL given a long URL
    var longUrl = req.body.url;
    var shortUrl = '';
    Url.findOne({ long_url: longUrl }, function(err, doc) {
        if (doc) { //IF FOUND
            shortUrl = config.webhost + 'shorten/' + base58.encode(doc._id);

            res.send({ 'shortUrl': shortUrl }); //RETURNS EXISTING ENTRY
        } else { //IF NOT FOUND~~CREATE NEW
            var newUrl = Url({
                long_url: longUrl
            });
            newUrl.save(function(err) {
                if (err) {
                    console.log(err);
                }
                shortUrl = config.webhost + 'shorten/' + base58.encode(doc._id);

                res.send({ 'shortUrl': shortUrl })
            });
        }
    });
});

// route to redirect the visitor to their original URL given the short URL
router.get('/:encoded_id', function(req, res) {
    var base58Id = req.params.encoded_id;
    var id = base58.decode(base58Id);
    //CHECKING EXISTENCE
    Url.findOne({ _id: id }, function(err, doc) {
        if (doc) {
            //FOUND, then REDIRECTING
            res.redirect(doc.long_url);

        } else {
            res.redirect(process.env.PORT + 'home');
        }
    })
});