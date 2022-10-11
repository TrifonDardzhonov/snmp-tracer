const snmpEndpointRepository = require("../repository/json/snmpEndpointRepository");
const snmpResponseRepository = require("../repository/csv/snmpResponseRepository");
const scriptOutputRepository = require("../repository/csv/scriptOutputRepository");

const database = function () {
    const endpoints = new snmpEndpointRepository();
    const responses = new snmpResponseRepository();
    const scriptsOutputs = new scriptOutputRepository();

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
        }, snmpEndpointResponses: function (endpointId, startDate, endDate) {
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
        }, updateGroupScript(scripts) {
            return new Promise((resolve) => {
                endpoints.updateGroupScript(scripts).then(success => {
                    resolve(success);
                });
            });
        }, scriptsOutputs(startDate, endDate, endpointId, groupId, snmpResponseId) {
            return new Promise((resolve) => {
                scriptsOutputs.read(startDate, endDate, endpointId, groupId, snmpResponseId).then(outputs => {
                    resolve(outputs);
                });
            });
        }
    }
};

module.exports = database;