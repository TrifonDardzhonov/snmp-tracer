const fs = require("fs");
const endpointStatus = require("../../enums/endpoint-status");

const filePath = "~/../../snmp-server/database/json/snmpEndpoints.json";

const snmpEndpointRepository = function () {
    function writeConfig(config) {
        fs.writeFile(filePath, JSON.stringify(config), err => {
            if (err) {
                console.error(err);
            }
            //file written successfully
        });
    }

    return {
        read() {
            return new Promise((resolve) => {
                fs.readFile(filePath, "utf8", function (err, data) {
                    if (err) throw err;
                    const config = JSON.parse(data);
                    resolve(config.nodes);
                });
            });
        }, add(endpoint) {
            return new Promise((resolve) => {
                fs.readFile(filePath, "utf8", function (err, data) {
                    if (err) throw err;
                    let groupId = 1;
                    const config = JSON.parse(data);
                    endpoint.id = config.nodes.length + 1;
                    if (endpoint.groupingMatch && endpoint.groupingMatch.length) {
                        endpoint.groupingMatch.forEach(group => group.id = groupId++);
                    }
                    if (endpoint.groupingBetween && endpoint.groupingBetween.length) {
                        endpoint.groupingBetween.forEach(group => group.id = groupId++);
                    }
                    config.nodes.push(endpoint);
                    writeConfig(config);
                    resolve(endpoint);
                });
            });
        }, setStatus(endpoint, status) {
            return new Promise((resolve) => {
                fs.readFile(filePath, "utf8", function (err, data) {
                    if (err) throw err;
                    const config = JSON.parse(data);
                    const node = config.nodes.filter(n => n.id === endpoint.id)[0];

                    if (!node) {
                        // throw new Error("Endpoint does not exist!");
                        resolve(false);
                    } else if (node.status.id === endpointStatus.Deleted) {
                        // throw new Error("Endpoints with status deleted can not be modified!");
                        resolve(false);
                    } else {
                        node.status = status;
                        config.nodes = config.nodes.map(n => {
                            if (n.id === node.id) {
                                return node;
                            } else {
                                return n;
                            }
                        });
                        writeConfig(config);
                        resolve(true);
                    }
                });
            });
        }, updateGroupScript(scripts) {
            return new Promise((resolve) => {
                fs.readFile(filePath, "utf8", function (err, data) {
                    if (err) throw err;
                    const config = JSON.parse(data);

                    // Update scripts of the passed groups
                    scripts.forEach(script => {
                        const node = config.nodes.find(n => n.id === script.endpointId);

                        if (node.groupingMatch && node.groupingMatch.length > 0) {
                            const foundGroup = node.groupingMatch.find(group => group.id == script.groupId);
                            if (foundGroup) {
                                foundGroup.script = script.script;
                            }
                        }

                        if (node.groupingBetween && node.groupingBetween.length > 0) {
                            const foundGroup = node.groupingBetween.find(group => group.id == script.groupId);
                            if (foundGroup) {
                                foundGroup.script = script.script;
                            }
                        }
                    });

                    writeConfig(config);
                    resolve(true);
                });
            });
        }
    }
};

module.exports = snmpEndpointRepository;