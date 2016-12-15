var express = require("express");
var poll = require("./models/poll.js");
var User = require("./models/user.js");
var base58 = require('./base58.js');
var router = express.Router();
module.exports = router;


//ALL POLLS
router.get('/polls', function(req, res) {
    poll.find({}, function(err, polls) {
        if (err) throw err;
        res.render("polls", {
            title: "Polls List",
            polls: polls
        });
    });

});
//ADD POLL
router.route('/polls/add')
    .get(function(req, res) {
        res.render("add");
    })
    .post(function(req, res) {
        var newPoll;
        var pollsChoices = [];
        req.body.choice.forEach(function(chosen) {
            pollsChoices.push({ "option": chosen, "value": 0 });
            newPoll = poll({
                name: req.body.name,
                choices: pollsChoices,
                admin: req.user._id,
                url: ""
            });
        });
        newPoll.save(function(err) {
            if (err) throw err;
            updatePoll();
            console.log("POll CREATED!");
        });
        //"updatePoll creates the long url so that we can later find it and shorten it.
        var updatePoll = function() {
            poll.update({ _id: { $eq: newPoll._id } }, { $set: { url: WEBHOST_URL + 'vote/' + newPoll._id } }, function(err, result) {
                if (err) throw err;
            });
        }
        console.log(process.env.PORT + 'vote/' + newPoll._id);
        res.redirect(req.baseUrl + "/polls");

    });


//ADMIN EDIT POLL LIST:
router.get('/adminpolls/:id', function(req, res) {
    var pid = req.params.id;
    poll.find({ admin: pid }, function(err, polls) {
        res.render("adminpolls", {
            title: "Admin Polls",
            polls: polls
        });
    });
});


//ADMIN EDITING PAGE
router.route('/edit/:id')
    .get(function(req, res) {
        var pid = req.params.id;
        poll.findById(pid, function(err, poll) {
            if (err) throw err;
            res.render('edit', {
                title: "EDIT PAGE",
                poll: poll
            });
        });
    })
    .post(function(req, res) {
        var pid = req.params.id;
        poll.findByIdAndUpdate(pid, { name: req.body.name }, function(err, poll) {
            if (err) throw err;
            poll.name = req.body.name;
        });
        res.redirect("/admin/polls");
    });

//DELETE POLL PAGE
router.route('/delete/:id')
    .get(function(req, res, user) {
        var pid = req.params.id;
        //removes the poll from just the polls collection
        poll.findByIdAndRemove(pid, function(err) {
            if (err) throw err;
        });
        res.redirect("/home");
    });