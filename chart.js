var express = require("express");
var poll = require("./models/poll.js");
//var uuid = require("node-uuid");
var router = express.Router();
module.exports = router;


//RENDERS THE POLL WITHIN THE CHART
router.get('/:id', function (req, res) {
    var pid = req.params.id;

    poll.findById(pid, function (err, poll) {
        if (err) throw err;
        res.render('chart', {
            title: "Charts",
            poll: poll,
        });
    });
});

router.post('/:id', function (req, res) {
    var count = parseInt(req.body.value);
    var chosenOption = req.body.option;

});