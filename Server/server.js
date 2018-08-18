var express = require("express")
var snmpController = require("./snmpController");
var controller = new snmpController();
var bodyParser = require('body-parser');

app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
port = process.env.port || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.listen(3000);

app.route('/snmpEndpoints')
    .get(function (req, res) {
        res.json(controller.snmpEndpoints());
    })
    .post(function (req, res) {
        console.log(req);
        res.json(req.body + "haha");
    });

console.log("listening on port: " + port);