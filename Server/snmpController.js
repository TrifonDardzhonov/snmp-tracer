const snmpRepository = require('./snmpRepository');

const snmpController = function () {
    const snmpStore = new snmpRepository();
    return {
        snmpEndpoints: function () {
            return new Promise((resolve) => {
                snmpStore.endpoints().then(endpoints => {
                    resolve(endpoints);
                });
            });
        }, addSNMPEndpoint: function (endpoint) {
            return new Promise((resolve) => {
                snmpStore.addEndpoint(endpoint).then(result => {
                    resolve(result);
                });
            });
        }, snmpEndpointData: function (endpointId, startDate, endDate) {
            return new Promise((resolve) => {
                snmpStore.read(endpointId, startDate, endDate, 1000).then(data => {
                    resolve(data);
                });
            });
        }, setSNMPEndpointStatus(endpoint, status) {
            return new Promise((resolve) => {
                snmpStore.setStatus(endpoint, status).then(success => {
                    resolve(success);
                });
            });
        }
    }
};

module.exports = snmpController;