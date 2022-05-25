const fs = require("fs");
const csv = require("fast-csv");
const crypto = require("crypto");

const filePath = "~/../../snmp-server/database/csv/snmpResponses.csv";

const csvStream = csv.createWriteStream({
    headers: true
});
writableStream = fs.createWriteStream(filePath);
csvStream.pipe(writableStream);

const snmpResponseRepository = function () {
    return {
        write: function (snmpResponse) {
            const id = crypto.randomBytes(16).toString("hex");
            csvStream.write({
                id: id,
                endpointId: snmpResponse.endpointId,
                oid: snmpResponse.oid,
                host: snmpResponse.host,
                port: snmpResponse.port,
                community: snmpResponse.community,
                value: snmpResponse.value,
                groupId: snmpResponse.groupId,
                group: snmpResponse.group,
                dateticks: snmpResponse.dateticks
            }, {
                headers: true
            });
            return id;
        }, read: function (endpointId, startDate, endDate, lastNRecords) {
            return new Promise((resolve) => {
                const responses = [];

                csv.fromPath(filePath, {
                    headers: true
                })
                    .transform(function (data) {
                        return {
                            id: data.id,
                            endpointId: Number(data.endpointId),
                            oid: Array.isArray(data.oid) ? data.oid : data.oid.split(',').map(id => Number(id)),
                            host: data.host,
                            port: Number(data.port),
                            community: data.community,
                            value: data.value,
                            groupId: data.groupId,
                            group: data.group,
                            dateticks: data.dateticks
                        }
                    })
                    .validate(function (endpointResult) {
                        return endpointResult.endpointId === endpointId;
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
        }
    }
};

module.exports = snmpResponseRepository;