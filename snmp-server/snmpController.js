const snmpRepository = require('./snmpRepository');

const snmpController = function () {
    const db = new snmpRepository();
    return {
        snmpEndpoints: function () {
            return new Promise((resolve) => {
                db.endpoints().then(endpoints => {
                    resolve(endpoints);
                });
            });
        }, addSNMPEndpoint: function (endpoint) {
            return new Promise((resolve) => {
                db.addEndpoint(endpoint).then(result => {
                    resolve(result);
                });
            });
        }, snmpEndpointData: function (endpointId, startDate, endDate) {
            return new Promise((resolve) => {
                db.read(endpointId, startDate, endDate, 1000).then(data => {
                    resolve(data);
                });
            });
        }, setSNMPEndpointStatus(endpoint, status) {
            return new Promise((resolve) => {
                db.setStatus(endpoint, status).then(success => {
                    resolve(success);
                });
            });
        }
    }
};

module.exports = snmpController;