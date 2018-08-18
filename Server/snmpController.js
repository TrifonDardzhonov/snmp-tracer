var snmpRepository = require('./snmpRepository');

var snmpController = function () {
    const snmpRepo = new snmpRepository();
    return {
        snmpEndpoints: function () {
            return snmpRepo.endpoints();
        }
    }
};

module.exports = snmpController;