const fs = require('fs');
const csv = require('fast-csv');
const endpointStatus = require('./enums/endpoint-status');

const csvStream = csv.createWriteStream({
    headers: true
});
writableStream = fs.createWriteStream('db.csv');
csvStream.pipe(writableStream);

const snmpRepository = function () {
    const dataFilePath = 'db.csv';
    const configFilePath = 'config.json';

    function writeConfig(config) {
        fs.writeFile(configFilePath, JSON.stringify(config), err => {
            if (err) {
                console.error(err);
            }
            //file written successfully
        });
    }

    return {
        write: function (snmp) {
            csvStream.write({
                id: snmp.id,
                oid: snmp.oid,
                host: snmp.host,
                port: snmp.port,
                community: snmp.community,
                value: snmp.value,
                group: snmp.group,
                dateticks: snmp.dateticks
            }, {
                headers: true
            });
        }, read: function (endpointId, startDate, endDate, lastNRecords) {
            return new Promise((resolve) => {
                const responses = [];

                csv.fromPath(dataFilePath, {
                    headers: true
                })
                    .transform(function (data) {
                        return {
                            id: Number(data.id),
                            oid: Array.isArray(data.oid) ? data.oid : data.oid.split(',').map(id => Number(id)),
                            host: data.host,
                            port: Number(data.port),
                            community: data.community,
                            value: data.value,
                            group: data.group,
                            dateticks: data.dateticks
                        }
                    })
                    .validate(function (endpointResult) {
                        return endpointResult.id === endpointId;
                    })
                    .on("data", function (endpointResult) {
                        responses.push(endpointResult);
                    })
                    .on("end", function () {
                        const startDateTicks = new Date(startDate).getTime();
                        const endDateTicks = new Date(endDate).getTime();

                        const filteredResponses = responses.filter(r => startDateTicks <= r.dateticks && r.dateticks <= endDateTicks);

                        const spliceStart = lastNRecords < filteredResponses.length ? (filteredResponses.length - lastNRecords) : 0;
                        const spliceEnd = filteredResponses.length - 1;

                        resolve({
                            responses: filteredResponses.splice(spliceStart, spliceEnd)
                        });
                    });
            })
        }, endpoints() {
            return new Promise((resolve) => {
                fs.readFile(configFilePath, 'utf8', function (err, data) {
                    if (err) throw err;
                    const config = JSON.parse(data);
                    resolve(config.nodes);
                });
            });
        }, addEndpoint(endpoint) {
            return new Promise((resolve) => {
                fs.readFile(configFilePath, 'utf8', function (err, data) {
                    if (err) throw err;
                    const config = JSON.parse(data);
                    endpoint.id = config.nodes.length + 1;
                    config.nodes.push(endpoint);
                    writeConfig(config);
                    resolve(endpoint);
                });
            });
        }, setStatus(endpoint, status) {
            return new Promise((resolve) => {
                fs.readFile(configFilePath, 'utf8', function (err, data) {
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

module.exports = snmpRepository;