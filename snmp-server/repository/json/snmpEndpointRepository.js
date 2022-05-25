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
                    const script = "versions.bat";
                    endpoint.id = config.nodes.length + 1;
                    if (endpoint.groupingMatch && endpoint.groupingMatch.length) {
                        endpoint.groupingMatch.forEach(group => group.id = groupId++);
                        endpoint.groupingMatch.forEach(group => group.script = `${endpoint.id}_${group.id}_${script}`);
                    }
                    if (endpoint.groupingBetween && endpoint.groupingBetween.length) {
                        endpoint.groupingBetween.forEach(group => group.id = groupId++);
                        endpoint.groupingBetween.forEach(group => group.script = `${endpoint.id}_${group.id}_${script}`);
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
        }
    }
};

module.exports = snmpEndpointRepository;