var fs = require('fs');
var snmpEndpoint = require("./snmpEndpoint");

var snmpRepository = function () {
    const filePath = 'db.json';

    var isSameEndpoint = function (e1, e2) {
        return e1.oid !== undefined &&
            e1.oid.every(function (u, i) {
                return u === e2.oid[i];
            }) &&
            e1.host === e2.host &&
            e1.port === e2.port;
    }

    return {
        write: function (jsonData) {
            fs.appendFile(filePath, JSON.stringify(jsonData) + '\r\n', function (err) {
                if (err) {
                    // return console.log(err);
                }
            });
        },
        read: function (endpoint) {
            return new Promise((resolve, reject) => {
                const data = {
                    type: endpoint.friendlyName,
                    responses: []
                };

                fs.readFile(filePath, 'utf8', function (err, r) {
                    if (err) throw err;
                    results = JSON.parse(r);
                    results.data.forEach(endpointResult => {
                        if (isSameEndpoint(endpointResult, endpoint)) {
                            data.responses.push({
                                value: endpointResult.value,
                                group: endpointResult.group,
                                dateticks: endpointResult.dateticks //new Date().getTime()
                            });

                            if (data.responses.length === 10) {
                                resolve(data)
                            }
                        }
                    });

                });
            })
        },
        endpoints() {
            return new Promise((resolve, reject) => {
                fs.readFile('config.json', 'utf8', function (err, data) {
                    console.log(data);
                    if (err) throw err;
                    config = JSON.parse(data);
                    console.log(config.nodes)
                    resolve(config.nodes);
                });
            });
        },
        addSNMPEndpoint(endpoint) {
            return new Promise((resolve, reject) => {
                fs.readFile('config.json', 'utf8', function (err, data) {
                    if (err) throw err;
                    config = JSON.parse(data);
                    config.nodes.push(endpoint);
                    fs.writeFile('config.json', JSON.stringify(config), 'utf8'); // write it back
                    resolve(true);
                });
            });
        }
    }
}

module.exports = snmpRepository;