const snmp = require("snmp-native");
const mib = require("./HOST-RESOURCES-MIB.json");

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

function mockExtractSubtree(node) {
    const varbinds = [];
    Object.keys(mib).forEach(key => {
        const obj = mib[key];

        if (obj.oid !== undefined && obj.syntax !== undefined && obj.syntax.type === "Integer32") {
            if (obj.oid.startsWith(node.oid.join("."))) {
                varbinds.push({
                    oid: obj.oid.split(".").join(","),
                    name: obj.name,
                    value: Math.floor(Math.random() * 11),
                    description: obj.description
                });
            }
        }
    });
    return Promise.resolve(varbinds);
}

const snmpClient = function () {
    return {
        extractSubtree: mockExtractSubtree
    }
};

module.exports = snmpClient;