var snmpClient = require('./snmpClient');
var snmpRepository = require('./snmpRepository');
var SNMPResponse = require('./snmpResponse');

const client = new snmpClient();
const snmpStore = new snmpRepository();
const intervalInSeconds = 20;

function visitNodes() {
    visitEachNode();
    setTimeout(visitNodes, seconds(intervalInSeconds));
}

function seconds(sec) {
    return sec * 1000;
}

function visitEachNode() {
    snmpStore.endpoints().then(endpoints => {
        endpoints.forEach((node) => {
            client.extractSubtree(node).then(varbinds => {
                if (varbinds) {
                    varbinds.forEach(bind => {

                        var snmpResponse = SNMPResponse(
                            node.id,
                            node.oid,
                            node.host,
                            node.port,
                            node.community,
                            bind.value,
                            group(node, bind.value));

                        snmpStore.write(snmpResponse);
                    });
                }
            });
        })
    });
}

function group(node, value) {
    if (node.supportGrouping) {
        if (node.groupingBetween.length > 0) {
            for (let i = 0; i < node.groupingBetween.length; i++) {
                const from = Number(node.groupingBetween[i].from);
                const to = Number(node.groupingBetween[i].to);
                if (from >= Number(value) && Number(value) <= to) {
                    return node.groupingBetween[i].result;
                }
            }
        }

        if (node.groupingMatch.length > 0) {
            for (let i = 0; i < node.groupingMatch.length; i++) {
                if (node.groupingMatch[i].original == value) {
                    return node.groupingMatch[i].result;
                }
            }
        }
    }

    return "N/A"
}

var snmpListener = function () {
    return {
        start: visitNodes,
        endpointData: client.extractSubtree
    }
}

module.exports = snmpListener;