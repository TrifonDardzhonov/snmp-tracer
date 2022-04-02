const snmpClient = require('./snmpClient');
const snmpRepository = require('./snmpRepository');
const SNMPResponse = require('./snmpResponse');
const endpointStatus = require('./enums/endpoint-status');
const snmpGroup = require('./snmpGroup');

const client = new snmpClient();
const snmpStore = new snmpRepository();

const intervalBetweenSNMPRequests = 20;

function start() {
    visitNodes();
}

function visitNodes() {
    visitEachNode();
    setTimeout(visitNodes, seconds(intervalBetweenSNMPRequests));
}

function seconds(sec) {
    return sec * 1000;
}

function visitEachNode() {
    snmpStore.endpoints().then(endpoints => {
        const activeEndpoints = endpoints.filter((node) => node.status.id === endpointStatus.Active);

        activeEndpoints.forEach((node) => {
            client.extractSubtree(node).then(varbinds => {
                if (varbinds) {
                    varbinds.forEach(bind => {
                        var group = snmpGroup.findGroup(node, bind.value);
                        var snmpResponse = SNMPResponse(node.id, node.oid, node.host, node.port, node.community, bind.value, group.value);
                        snmpStore.write(snmpResponse);
                        // add additional handling here
                    });
                }
            });
        })
    });
}

const snmpListener = function () {
    return {
        start: start, endpointData: client.extractSubtree
    }
};

module.exports = snmpListener;