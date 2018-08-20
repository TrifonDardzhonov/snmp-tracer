var snmp = require('snmp-native');

function extractSubtree(node) {
    var session = new snmp.Session({
        host: node.host,
        port: node.port,
        community: node.community
    });

    return new Promise((resolve, reject) => {
        session.getSubtree({
            oid: node.oid
        }, function (error, varbinds) {
            if (error) {
                console.log('Fail :(');
            } else {
                resolve(varbinds);
            }
        });
    })
}

var snmpClient = function () {
    return {
        extractSubtree: extractSubtree
    }
}

module.exports = snmpClient;