var fs = require('fs');
var csv = require('fast-csv');
var endpointStatus = require('./enums/endpoint-status')

var csvStream = csv.createWriteStream({
    headers: true
});
writableStream = fs.createWriteStream('db.csv');
csvStream.pipe(writableStream);

var snmpRepository = function () {
    const dataFilePath = 'db.csv';
    const configFilePath = 'config.json';

    return {
        write: function (snmp) {
            csvStream.write({
                id: snmp.id,
                oid: snmp.oid,
                host: snmp.host,
                port: snmp.port,
                community: snmp.community,
                value: snmp.value,
                group: snmp.group,
                dateticks: snmp.dateticks
            }, {
                    headers: true
                });
        },
        read: function (endpoint, nRecords) {
            return new Promise((resolve, reject) => {
                const responses = [];

                csv.fromPath(dataFilePath, {
                    headers: true
                })
                    .transform(function (data) {
                        return {
                            id: Number(data.id),
                            oid: Array.isArray(data.oid) ? data.oid : data.oid.split(',').map(id => Number(id)),
                            host: data.host,
                            port: Number(data.port),
                            community: data.community,
                            value: data.value,
                            group: data.group,
                            dateticks: data.dateticks
                        }
                    })
                    .validate(function (endpointResult) {
                        return endpointResult.id === endpoint.id;
                    })
                    .on("data", function (endpointResult) {
                        responses.push(endpointResult);
                    })
                    .on("end", function () {
                        resolve({
                            responses: responses.splice(responses.length - nRecords, responses.length - 1)
                        });
                    });
            })
        },
        endpoints() {
            return new Promise((resolve, reject) => {
                fs.readFile(configFilePath, 'utf8', function (err, data) {
                    if (err) throw err;
                    config = JSON.parse(data);
                    resolve(config.nodes);
                });
            });
        },
        addEndpoint(endpoint) {
            return new Promise((resolve, reject) => {
                fs.readFile(configFilePath, 'utf8', function (err, data) {
                    if (err) throw err;
                    config = JSON.parse(data);
                    endpoint.id = config.nodes.length + 1;
                    config.nodes.push(endpoint);
                    fs.writeFile(configFilePath, JSON.stringify(config), 'utf8');
                    resolve(endpoint);
                });
            });
        },
        setStatus(endpoint, status) {
            return new Promise((resolve, reject) => {
                fs.readFile(configFilePath, 'utf8', function (err, data) {
                    if (err) throw err;
                    config = JSON.parse(data);
                    const node = config.nodes.filter(n => n.id === endpoint.id)[0];

                    if (!node) {
                        // throw new Error("Endpoint does not exist!");
                        resolve(false);
                    } else if (node.status.id === endpointStatus.Deleted) {
                        // throw new Error("Endpoints with status deleted can not be modified!");
                        resolve(false);
                    } else {
                        node.status = status;
                        config.nodes = config.nodes.map(n => {
                            if (n.id === node.id) {
                                return node;
                            } else {
                                return n;
                            }
                        });
                        fs.writeFile(configFilePath, JSON.stringify(config), 'utf8');
                        resolve(true);
                    }
                });
            });
        }
    }
}

module.exports = snmpRepository;