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
        controller.snmpEndpoints().then(endpoints => {
            res.json(endpoints);
        });
    })
    .post(function (req, res) {
        var endPoint = mapSNMPEndpointModel(req);
        controller.addSNMPEndpoint(endPoint).then(result => {
            res.json(result);
        });
    });

app.route('/snmpEndpoint/data')
    .post(function (req, res) {
        var endPoint = mapSNMPEndpointModel(req);
        controller.snmpEndpointData(endPoint).then((data) => {
            res.json([data]);
        });
    })

app.route('/snmpEndpoints/test')
    .post(function (req, res) {
        var endPoint = mapSNMPEndpointModel(req);
        worker.test(endPoint).then((varbinds) => {
            res.json(varbinds);
        });
    });

function mapSNMPEndpointModel(req) {
    return {
        friendlyName: req.body.friendlyName,
        oid: req.body.oid.split(',').map(id => Number(id)),
        host: req.body.host,
        port: Number(req.body.port),
        community: req.body.community,
        supportGrouping: req.body.supportGrouping
    }
}

//snmpWorker.start();