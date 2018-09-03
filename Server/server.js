var express = require("express")
var snmpController = require("./snmpController");
var snmpListener = require("./snmpListener");
var bodyParser = require('body-parser');

var controller = new snmpController();
var listener = new snmpListener();

function mapSNMPEndpointModel(req) {
    return {
        id: req.body.id 
            ? Number(req.body.id) 
            : null,
        friendlyName: req.body.friendlyName,
        description: req.body.description,
        oid: Array.isArray(req.body.oid) 
            ? req.body.oid 
            : req.body.oid.split(',').map(id => Number(id)),
        host: req.body.host,
        port: Number(req.body.port),
        community: req.body.community,
        status: req.body.status,
        supportGrouping: req.body.supportGrouping,
        groupingMatch: req.body.groupingMatch,
        groupingBetween: req.body.groupingBetween
    }
}

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
        // get all snmp endpoints
        controller.snmpEndpoints().then(endpoints => {
            res.json(endpoints);
        });
    })
    .post(function (req, res) {
        // add new snmp endpoint
        var endPoint = mapSNMPEndpointModel(req);
        controller.addSNMPEndpoint(endPoint).then(result => {
            res.json(result);
        });
    });

app.route('/snmpEndpoint/data')
    .post(function (req, res) {
        // get last 100 data records for requested endpoint
        var endPoint = mapSNMPEndpointModel(req);
        controller.snmpEndpointData(endPoint).then((data) => {
            res.json([data]);
        });
    })

app.route('/snmpEndpoints/test')
    .post(function (req, res) {
        // send one snmp request and return the data
        var endPoint = mapSNMPEndpointModel(req);
        listener.endpointData(endPoint).then((varbinds) => {
            res.json(varbinds);
        });
    });

listener.start();