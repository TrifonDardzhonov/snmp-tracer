var fs = require('fs');
var os = require("os");

var snmpRepository = function () {
    const dataFilePath = 'db.json';
    const configFilePath = 'config.json';

    var isSameEndpoint = function (e1, e2) {
        return e1.oid !== undefined &&
            e1.oid.every(function (u, i) {
                return u === e2.oid[i];
            }) &&
            e1.host === e2.host &&
            e1.port === e2.port &&
            e1.community === e2.community;
    }

    return {
        write: function (jsonData) {
            fs.appendFile(dataFilePath, JSON.stringify(jsonData) + os.EOL, function (err) {});
        },
        read: function (endpoint) {
            return new Promise((resolve, reject) => {
                const data = {
                    type: endpoint.friendlyName,
                    responses: []
                };

                fs.readFile(dataFilePath, 'utf8', function (err, r) {
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