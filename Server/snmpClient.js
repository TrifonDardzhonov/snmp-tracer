const snmp = require('snmp-native');

function extractSubtree(node) {
    const session = new snmp.Session({
        host: node.host, port: node.port, community: node.community
    });

    return new Promise((resolve) => {
        session.getSubtree({
            oid: node.oid
        }, function (error, varbinds) {
            if (error) {
                console.log('Fail :(', error);
            } else {
                resolve(varbinds);
            }
        });
    })
}

const snmpClient = function () {
    return {
        extractSubtree: extractSubtree
    }
};

module.exports = snmpClient;