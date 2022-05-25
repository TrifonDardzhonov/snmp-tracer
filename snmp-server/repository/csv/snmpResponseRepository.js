const fs = require('fs');
const csv = require('fast-csv');

const filePath = '~/../../snmp-server/database/csv/snmpResponses.csv';

const csvStream = csv.createWriteStream({
    headers: true
});
writableStream = fs.createWriteStream(filePath);
csvStream.pipe(writableStream);

const snmpResponseRepository = function () {
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

                csv.fromPath(filePath, {
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
        }
    }
};

module.exports = snmpResponseRepository;