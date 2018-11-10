var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/scoreDB',{ useNewUrlParser: true });

var scoreSchema = mongoose.Schema({
    Score: Number
});

var Score = mongoose.model('Score', scoreSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected');
});

router.get('/', function(req, res) {
  res.sendFile('game.html', { root: 'public' });
});

router.post('/score', function(req, res, next) {
    console.log(req.body);
    var newscore = new Score(req.body); 
    console.log(newscore); 
    newscore.save(function(err, post) { 
        if (err) return console.error(err);
        console.log(post);
        res.sendStatus(200);
    });
});

router.get('/score', function(req, res, next) {
    Score.find(function(err, scoreList) {
        if (err) return console.error(err);
        else {
            console.log(scoreList);
            res.json(scoreList);
        }
    });
});

module.exports = router;