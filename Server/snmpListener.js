var snmpClient = require('./snmpClient');
var snmpRepository = require('./snmpRepository');
var SNMPResponse = require('./snmpResponse');
var endpointStatus = require('./enums/endpoint-status');
var snmpGroup = require('./snmpGroup');
var swarmService = require('./swarmService');

const client = new snmpClient();
const snmpStore = new snmpRepository();
const swarm = new swarmService();
const intervalInSeconds = 20;

function start() {
    swarm.init();
    visitNodes();
}

function visitNodes() {
    visitEachNode();
    setTimeout(visitNodes, seconds(intervalInSeconds));
}

function seconds(sec) {
    return sec * 1000;
}

function visitEachNode() {
    snmpStore.swarmConfig().then((swarmConf) => {
        snmpStore.endpoints().then(endpoints => {
            endpoints.filter((node) => node.status.id === endpointStatus.Active).forEach((node) => {
                client.extractSubtree(node).then(varbinds => {
                    if (varbinds) {
                        varbinds.forEach(bind => {
                            var group = snmpGroup.findGroup(node, bind.value);
                            var snmpResponse = SNMPResponse(node.id, node.oid, node.host, node.port, node.community, bind.value, group.value);
                            snmpStore.write(snmpResponse);
                            if (group.scale) {
                                if (group.scale.up) {
                                    swarm.scaleUp(swarmConf.service);
                                }
                            }
                        });
                    }
                });
            })
        });
    });
}

var snmpListener = function () {
    return {
        start: start,
        endpointData: client.extractSubtree
    }
}

module.exports = snmpListener;