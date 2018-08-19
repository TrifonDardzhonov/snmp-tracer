var fs = require('fs');
var csv = require('fast-csv');

var csvStream = csv.createWriteStream({
    headers: true
});
writableStream = fs.createWriteStream('db.csv');
csvStream.pipe(writableStream);

var snmpRepository = function () {
    const dataFilePath = 'db.csv';
    const configFilePath = 'config.json';

    var isSameEndpoint = function (e1, e2) {
        return e1.oid !== undefined &&
            e1.oid.length === e2.oid.length &&
            e1.oid.every(function (u, i) {
                return u === e2.oid[i];
            }) &&
            e1.host === e2.host &&
            e1.port === e2.port &&
            e1.community === e2.community;
    }

    return {
        write: function (snmp) {
            csvStream.write({
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
        read: function (endpoint) {
            return new Promise((resolve, reject) => {
                const result = {
                    type: endpoint.friendlyName,
                    responses: []
                };

                csv.fromPath(dataFilePath, {
                        headers: true
                    })
                    .transform(function (data) {
                        return {
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
                        return isSameEndpoint(endpointResult, endpoint);
                    })
                    .on("data", function (endpointResult) {
                        result.responses.push(endpointResult);
                    })
                    .on("end", function () {
                        resolve(result);
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
                    config.nodes.push(endpoint);
                    fs.writeFile(configFilePath, JSON.stringify(config), 'utf8');
                    resolve(true);
                });
            });
        }
    }
}

module.exports = snmpRepository;