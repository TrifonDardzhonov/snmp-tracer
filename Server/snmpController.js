var snmpRepository = require('./snmpRepository');

var snmpController = function () {
    const snmpRepo = new snmpRepository();
    return {
        snmpEndpoints: function () {
            snmpRepo.read({
                "oid":[1,3,6,1,2,1,1],
                "host":"demo.snmplabs.com",
                "port":161,
                "community":"public"});
                
            return snmpRepo.endpoints();
        },
        addSNMPEndpoint: function (endpoint) {
            return snmpRepo.addSNMPEndpoint(endpoint);
        }
    }
};

module.exports = snmpController;