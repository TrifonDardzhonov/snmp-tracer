const snmpEndpointRepository = require('../repository/json/snmpEndpointRepository');
const snmpResponseRepository = require('../repository/csv/snmpResponseRepository');

const database = function () {
    const endpoints = new snmpEndpointRepository();
    const responses = new snmpResponseRepository();

    return {
        snmpEndpoints: function () {
            return new Promise((resolve) => {
                endpoints.read().then(endpoints => {
                    resolve(endpoints);
                });
            });
        }, addSNMPEndpoint: function (endpoint) {
            return new Promise((resolve) => {
                endpoints.add(endpoint).then(result => {
                    resolve(result);
                });
            });
        }, snmpEndpointData: function (endpointId, startDate, endDate) {
            return new Promise((resolve) => {
                responses.read(endpointId, startDate, endDate, 1000).then(responses => {
                    resolve(responses);
                });
            });
        }, setSNMPEndpointStatus(endpoint, status) {
            return new Promise((resolve) => {
                endpoints.setStatus(endpoint, status).then(success => {
                    resolve(success);
                });
            });
        }
    }
};

module.exports = database;