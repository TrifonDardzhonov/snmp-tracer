const snmp = require("snmp-native");

function extractSubtree(node) {
    const session = new snmp.Session({
        host: node.host, port: node.port, community: node.community
    });

    return new Promise((resolve) => {
        session.getSubtree({
            oid: node.oid
        }, function (error, varbinds) {
            if (error) {
                console.log("Fail :(", error);
            } else {
                resolve(varbinds);
            }
        });
    })
}

function mockExtractSubtree() {
    return Promise.resolve([{value: Math.floor(Math.random() * 11)}]);
}

const snmpClient = function () {
    return {
        extractSubtree: mockExtractSubtree
    }
};

module.exports = snmpClient;