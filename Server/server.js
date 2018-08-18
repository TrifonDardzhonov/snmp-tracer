var express = require("express")
var snmpController = require("./snmpController");
var snmpWorker = require("./snmpWorker");
var bodyParser = require('body-parser');

var controller = new snmpController();
var worker = new snmpWorker();

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
        res.json(controller.addSNMPEndpoint(req.body));
    });

app.route('/snmpEndpoints/test')
    .post(function (req, res) {
        var endPoint = {
            oid: req.body.oid.split(',').map(id => Number(id)),
            host: req.body.host,
            port: Number(req.body.port),
            community: req.body.community
        }
        res.json({
            result: worker.test(endPoint)
        });
    });

snmpWorker.start();