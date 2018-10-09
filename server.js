var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public/dist/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rmcakes_db');

var cakeSchema = new mongoose.Schema({
    baker: {
        type: String,
        required: [true, 'Must enter baker name']
    },
    image: {
        type: String,
        required: [true, 'Must have picture of cake']
    },
    ratingVal: {
        type: Array
    },
    overallRating: {
        type: Number
    },
    timesRated: {
        type: Number
    }
})
mongoose.model('Cake', cakeSchema);
var Cake = mongoose.model('Cake');

app.get('/cakes', function (req, res) {
    console.log("See?")
    Cake.find({}, function (err, result) {
        if (err) {
            console.log("error while loading page: ", err)
            res.json(err)
        } else {
            console.log("HERE ARE THE CAKES: ", result)
            res.json(result)
        }
    })
})

app.post('/cakes', function (req, res) {
    Cake.create({ baker: req.body.baker, image: req.body.image }, function (err, cake) {
        if (err) {
            console.log("Error while creating: ", err);
            res.json(err);
        } else {
            console.log("Successfully created cake", cake);
            res.json(cake);
        }
    })
})
app.get('/cakes/rating/:id', function (req, res) {
    console.log("pardon?")
    Cake.findOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            console.log("Error while getting one cake: ", err)
            res.json(err)
        } else {
            console.log("Successfully obtained one cake: ", result, "Here is ratingVal", result.ratingVal);
            res.json(result)
        }
    })
})

app.delete('/cakes/:id', function (req, res) {
    Cake.findOneAndRemove({ _id: req.params.id }, function (result) {
        console.log("Successfully deleted");
        res.json(result);
    })
})

app.put('/cakes/update/:id', function (req, res) {
    Cake.findOneAndUpdate({ _id: req.params.id }, { baker: req.body.baker, image: req.body.image }, function (err, result) {
        if (err) {
            console.log("error while updating: ", err)
            res.json(err)
        } else {
            res.json(result)
        }

    })
})


app.put('/cakes/rate/:id', function(req, res){
    console.log("KOKO NI", req.body)
    console.log("REQ.BODY.NUM", req.body.num)
    Cake.findOneAndUpdate({_id: req.params.id}, {$push:{ratingVal: req.body}, $inc:{overallRating: req.body.num, timesRated: 1}, }, function(err, result){
        if(err){
            console.log("error while rating: ", err)
            res.json(err)
        } else {
            res.json(result)
        }
    })
})

app.get('/cakes/:id', function (req, res) {
    Cake.findOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            console.log("Error while getting one cake: ", err)
            res.json(err)
        } else {
            console.log("Successfully obtained one cake: ", result);
            res.json(result)
        }
    })
})

app.listen(8000, function(){
    console.log('Listening on 8thou')
})