// const express = require('express');
// const router = express.Router();
var router = require('express').Router(),
    bodyParser = require('body-parser'),
    express = require("express"),
    basicAuth = require('express-basic-auth');

var app = express();

app.use(bodyParser.json());

// Allow all CORS origins
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.use(basicAuth({
    users: { 'admin': 'abaco' }
}))

router.get('/', function (req, res, next) {
    res.status(200).send({
        title: "Api em execução",
        version: "0.0.1"
    });
});

router.use('/abaco', require('./abaco/users'));
router.use('/abaco', require('./abaco/warranty'));
router.use('/abaco', require('./abaco/vendor'));
router.use('/abaco', require('./abaco/operation'));
router.use('/abaco', require('./abaco/client'));
router.use('/abaco', require('./abaco/abaco'));
router.use('/abaco', require('./abaco/report'));


module.exports = router;