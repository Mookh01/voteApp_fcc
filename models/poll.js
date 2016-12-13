var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pollSchema = new Schema({
                name:{type: String, required: true, unique: true},
                choices: Array,
                admin: String,
                url: String
                });
var Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;