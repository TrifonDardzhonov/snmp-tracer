var snmpClient = require('./snmpClient');
var snmpRepository = require('./snmpRepository');
var SNMPResponse = require('./snmpResponse');
var endpointStatus = require('./enums/endpoint-status');
var snmpGroup = require('./snmpGroup');
var swarmService = require('./swarmService');
var swarmScaling = require('./swarmScaling');

const client = new snmpClient();
const snmpStore = new snmpRepository();
const swarm = new swarmService();

const initialWaitingForSwarm = 60;
const intervalBetweenSNMPRequests = 20;

function start() {
    swarm.init();
    setTimeout(visitNodes, seconds(initialWaitingForSwarm));
}

function visitNodes() {
    visitEachNode();
    setTimeout(visitNodes, seconds(intervalBetweenSNMPRequests));
}

function seconds(sec) {
    return sec * 1000;
}

function visitEachNode() {
    snmpStore.swarmConfig().then((swarmConf) => {
        snmpStore.endpoints().then(endpoints => {
            const activeEndpoints = endpoints.filter((node) => node.status.id === endpointStatus.Active);

            activeEndpoints.forEach((node) => {
                client.extractSubtree(node).then(varbinds => {
                    if (varbinds) {
                        varbinds.forEach(bind => {
                            var group = snmpGroup.findGroup(node, bind.value);
                            var snmpResponse = SNMPResponse(node.id, node.oid, node.host, node.port, node.community, bind.value, group.value);
                            snmpStore.write(snmpResponse);
                            if (group.scale) {
                                // For debugging purposes use swarmScaling.None because it's the default state
                                if (group.scale.status === swarmScaling.Up) {
                                    swarm.scaleUp(swarmConf.service);
                                } else if (group.scale.status === swarmScaling.Down) {
                                    swarm.scaleDown(swarmConf.service);
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