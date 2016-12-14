var express = require("express");
var passport = require("passport");
var flash = require('connect-flash');
var poll = require("./models/poll.js");
var User = require("./models/user.js");
var $ = require("jquery");
var jsdom = require("jsdom");
var router = express.Router();
module.exports = router;


//List-alt GLYPHICON:vote.jade   When clicked, 'vote.jade' radio button page is rendered.
router.get("/:id", function(req, res) {
    var pid = req.params.id;
    var votedlist = req.user.voted; 
    var userId = req.user.id;
    var searchResult;
    User.findById(userId, function(u) {
        for (i = 0; i < votedlist.length; i++) {
            if (pid === votedlist[i]) {
                searchResult = true;
                return searchResult;
            }
        }
        searchResult = false;
        return searchResult;
    });
    poll.findById(pid, function(err, poll) {
        if (err) throw err;
        if (searchResult) {
            req.flash('success_msg', "You've Already Voted, Congratulations");
            res.redirect('/admin/polls');
        } else {
            res.render('vote', {
                title: "Voting Booth",
                poll: poll,
                choice: req.params.choices,
                pollID: pid,
                data: searchResult
            });
        }
    });
});

//POSTING YOUR VOTE:vote.jade
router.post("/:id", function(req, res) {
    var count = parseInt(req.body.value) + 1;
    var chosenOption = req.body.option;
    var pollUrlId = req.header('Referer');
    var uniqPollId = pollUrlId.split("/").pop();
    poll.update({ 'choices.option': chosenOption }, { '$set': { 'choices.$.value': count } },
        function(err, poll) {
            if (err) throw err;
            User.findByIdAndUpdate(req.user._id, { $push: { voted: uniqPollId } }, function(err, user) {
                if (err) throw err;
            });
            res.redirect("/polls");
        });

});