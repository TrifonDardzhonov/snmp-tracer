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
                snmpStore.read(endpoint, 1000).then(data => {
                    resolve(data);
                });
            });
        },
        setSNMPEndpointStatus(endpoint, status) {
            return new Promise((resolve, reject) => {
                snmpStore.setSNMPEndpointStatus(endpoint, status).then(success => {
                    resolve(success);
                });
            });
        }
    }
};

module.exports = snmpController;