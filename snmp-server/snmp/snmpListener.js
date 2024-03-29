const snmpClient = require("./snmpClient");
const snmpEndpointRepository = require("../repository/json/snmpEndpointRepository");
const snmpResponseRepository = require("../repository/csv/snmpResponseRepository");
const scriptRunner = require("../scriptRunner");
const scriptOutputRepository = require("../repository/csv/scriptOutputRepository");
const SNMPResponse = require("../models/snmpResponse");
const ScriptOutput = require("../models/scriptOutput");
const endpointStatus = require("../enums/endpoint-status");
const groupFinder = require("./groupFinder");
const snmp = new snmpClient();
const endpoints = new snmpEndpointRepository();
const responses = new snmpResponseRepository();
const scripts = new scriptRunner();
const scriptsOutputs = new scriptOutputRepository();

function start() {
    visitNodes();
}

function visitNodes() {
    visitEachNode();
    setTimeout(visitNodes, seconds(20));
}

function seconds(sec) {
    return sec * 1000;
}

function visitEachNode() {
    endpoints.read().then(endpoints => {
        const activeEndpoints = endpoints.filter((node) => node.status.id === endpointStatus.Active);

        activeEndpoints.forEach((node) => {
            snmp.extractSubtree(node).then(varbinds => {
                if (varbinds) {
                    varbinds.forEach(bind => {
                        const group = groupFinder.find(node, bind.value);
                        const snmpResponse = SNMPResponse(
                            node.id, 
                            node.oid, 
                            node.host, 
                            node.port, 
                            node.community, 
                            bind.value,
                            group.id,
                            group.value
                        );
                        const snmpResponseId = responses.write(snmpResponse);

                        if (group.script) {
                            scripts.run(group.script).then((output) => {
                                const scriptOutput = ScriptOutput(
                                    snmpResponseId,
                                    node.id,
                                    group.id,
                                    group.script,
                                    output 
                                );
                                scriptsOutputs.write(scriptOutput);
                            });
                        }
                    });
                }
            });
        })
    });
}

const snmpListener = function () {
    return {
        start: start,
        endpointData: snmp.extractSubtree
    }
};

module.exports = snmpListener;