var fs = require('fs');
var readline = require('readline');
var snmpEndpoint = require("./snmpEndpoint");

var snmpRepository = function () {
    const filePath = 'db.json';

    var isSameEndpoint = function (e1, e2) {
        return e1.friendlyName === e2.friendlyName &&
            e1.oid !== undefined &&
            e1.oid.every(function (u, i) {
                return u === e2.oid[i];
            }) &&
            e1.host === e2.host &&
            e1.port === e2.port &&
            e1.community === e2.community &&
            e1.supportGrouping === e2.supportGrouping;
    }

    return {
        write: function (jsonData) {
            fs.appendFile(filePath, JSON.stringify(jsonData) + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        },
        read: function (endpoint) {
            var rd = readline.createInterface({
                input: fs.createReadStream(filePath),
                output: process.stdout,
                console: false
            });

            rd.on('line', function (endpointResult) {
                if (endpointResult && isSameEndpoint(endpointResult, endpoint)) {
                    console.log(endpointResult);
                }
            });
        },
        endpoints() {
            var endpoints = [
                new snmpEndpoint(
                    'Ping',
                    '1, 3, 6, 1, 2, 1, 1, 3, 0',
                    'demo.snmplabs.com',
                    161,
                    'public',
                    true
                ),
                new snmpEndpoint(
                    'Ping 2',
                    '1, 3, 6, 1, 2, 1, 1',
                    'demo.snmplabs.com',
                    161,
                    'public',
                    false
                )
            ];
            return endpoints;
        },
        addSNMPEndpoint(endpoint) {
            return true;
        }
    }
}

module.exports = snmpRepository;