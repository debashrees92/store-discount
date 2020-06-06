const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const cors = require('cors');
//const multer = require('multer');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const valFunctions = require('./validators/validate');

// create application/json parser
const jsonParser = bodyParser.json();
app.post('/signIn', jsonParser, function (req, res) {
    if(valFunctions.checkInputDataNULL(req,res)) return false;
    if(valFunctions.checkInputDataQuality(req,res)) return false;

    var dbFunctions = require('./models/connector');
    dbFunctions.signIn(req,res);
});
app.get('/getUser', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    var UserName = valFunctions.checkJWTToken(req,res);
    if(!UserName) return false;
    dbFunctions.getUser(UserName,res);
});
app.get('/getProductData', jsonParser, function (req, res) {
    var dbFunctions = require('./models/connector');
    dbFunctions.getProductData(req,res);
});
app.listen(process.env.PORT, ()=> console.log('readylocalhost:' + process.env.PORT));