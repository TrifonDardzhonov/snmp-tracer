var snmpRepository = require('./snmpRepository');

var snmpController = function () {
    const snmpRepo = new snmpRepository();
    return {
        snmpEndpoints: function () {
            return snmpRepo.endpoints();
        },
        addSNMPEndpoint: function (endpoint) {
            return snmpRepo.addSNMPEndpoint(endpoint);
        }
    }
};

module.exports = snmpController;