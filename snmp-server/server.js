const express = require("express")
const database = require("./database/database");
const snmpListener = require("./snmp/snmpListener");
const bodyParser = require("body-parser");

const db = new database();
const listener = new snmpListener();

function mapSNMPEndpointModel(endpoint) {
    return {
        id: endpoint.id ? Number(endpoint.id) : null,
        friendlyName: endpoint.friendlyName,
        description: endpoint.description,
        oid: Array.isArray(endpoint.oid) ? endpoint.oid : endpoint.oid.split(',').map(id => Number(id)),
        host: endpoint.host,
        port: Number(endpoint.port),
        community: endpoint.community,
        status: endpoint.status,
        supportGrouping: endpoint.supportGrouping,
        groupingMatch: endpoint.groupingMatch,
        groupingBetween: endpoint.groupingBetween
    }
}

function setUpCors(app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

function setUpBodyParser(app) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
}

function setUpPort(app) {
    let port = process.env.port || 3000;
    app.listen(port);
}

app = express();
setUpCors(app);
setUpBodyParser(app);
setUpPort(app);

app.route('/snmpEndpoints')
    .get(function (req, res) {
        // get all snmp endpoints
        db.snmpEndpoints().then(endpoints => {
            res.json(endpoints);
        });
    })
    .post(function (req, res) {
        // add new snmp endpoint
        const endPoint = mapSNMPEndpointModel(req.body);
        db.addSNMPEndpoint(endPoint).then(result => {
            res.json(result);
        });
    });

app.route('/snmpEndpoint/data')
    .post(function (req, res) {
        // get last 100 data records for requested endpoint
        const endPoint = mapSNMPEndpointModel(req.body.endpoint);
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        db.snmpEndpointData(endPoint.id, startDate, endDate).then((data) => {
            res.json(data);
        });
    });

app.route('/snmpEndpoint/setStatus')
    .post(function (req, res) {
        const endPoint = mapSNMPEndpointModel(req.body.endpoint);
        const status = req.body.status;
        db.setSNMPEndpointStatus(endPoint, status).then((success) => {
            res.json(success);
        });
    });

app.route('/snmpEndpoints/test')
    .post(function (req, res) {
        // send one snmp request and return the data
        const endPoint = mapSNMPEndpointModel(req.body);
        listener.endpointData(endPoint).then((varbinds) => {
            res.json(varbinds);
        });
    });

listener.start();