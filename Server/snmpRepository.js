var fs = require('fs');
var snmpEndpoint = require("./snmpEndpoint");

var snmpRepository = function () {
    const filePath = 'db.json';
    return {
        write: function (jsonData) {
            fs.appendFile(filePath, JSON.stringify(jsonData) + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
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