var snmpRepository = require('./snmpRepository');

var snmpController = function () {
    const snmpStore = new snmpRepository();
    return {
        snmpEndpoints: function () {
            return new Promise((resolve, reject) => {
                snmpStore.endpoints().then(endpoints => {
                    resolve(endpoints);
                });
            });
        },
        addSNMPEndpoint: function (endpoint) {
            return new Promise((resolve, reject) => {
                snmpStore.addEndpoint(endpoint).then(result => {
                    resolve(result);
                });
            });
        },
        snmpEndpointData: function (endpoint) {
            return new Promise((resolve, reject) => {
                snmpStore.read(endpoint).then(data => {
                    resolve(data);
                });
            });
        }
    }
};

module.exports = snmpController;