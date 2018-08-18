var snmpRepository = require('./snmpRepository');

var snmpController = function () {
    const snmpRepo = new snmpRepository();
    return {
        snmpEndpointData: function (endpoint) {
            return new Promise((resolve, reject) => {
                snmpRepo.read(endpoint).then(data => {
                    resolve(data);
                })
            })
        },
        snmpEndpoints: function () {
            return new Promise((resolve, reject) => {
                snmpRepo.endpoints().then(endpoints => {
                    resolve(endpoints);
                })
            })
        },
        addSNMPEndpoint: function (endpoint) {
            return new Promise((resolve, reject) => {
                snmpRepo.addSNMPEndpoint(endpoint).then(result => {
                    resolve(result);
                })
            });
        }
    }
};

module.exports = snmpController;