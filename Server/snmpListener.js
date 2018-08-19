var SNMPResponse = require('./snmpResponse');
var snmpRepository = require('./snmpRepository');
var snmp = require('snmp-native');

const snmpStore = new snmpRepository();

function visitNodes() {
    visitEachNode();
    setTimeout(visitNodes, seconds(10));
}

function seconds(sec) {
    return sec * 1000;
}

function visitEachNode() {
    snmpStore.endpoints().then(endpoints => {
        endpoints.forEach((node) => {
            extractSubtree(node).then(varbinds => {
                if (varbinds) {
                    varbinds.forEach(bind => {
                        var snmpResponse = SNMPResponse(node.oid, node.host, node.port, node.community, bind.value, "N/A");
                        snmpStore.write(snmpResponse);
                    });
                }
            });
        })
    });
}

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

var snmpListener = function () {
    return {
        start: visitNodes,
        endpointData: extractSubtree
    }
}

module.exports = snmpListener;