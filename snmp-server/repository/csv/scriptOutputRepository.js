const fs = require("fs");
const csv = require("fast-csv");

const filePath = "~/../../snmp-server/database/csv/scriptsOutputs.csv";

const csvStream = csv.createWriteStream({
    headers: true
});
writableStream = fs.createWriteStream(filePath);
csvStream.pipe(writableStream);

const scriptOutputRepository = function () {
    return {
        write: function (output) {
            console.log(`Script ${output.script} was executed`);
            console.log(`Output: ${output.text}`);

            csvStream.write({
                snmpResponseId: output.snmpResponseId,
                text: output.text,
                endpointId: output.endpointId,
                groupId: output.groupId,
                script: output.script,
                dateticks: (new Date()).getTime(),
            }, {
                headers: true
            });
        }, read: function (startDate, endDate, endpointId, groupId, snmpResponseId) {
            return new Promise((resolve) => {
                const outputs = [];

                csv.fromPath(filePath, {
                    headers: true
                })
                    .transform(function (data) {
                        return {
                            snmpResponseId: data.snmpResponseId,
                            text: data.text,
                            groupId: Number(data.groupId),
                            endpointId: Number(data.endpointId),
                            script: data.script,
                            dateticks: Number(data.dateticks)
                        }
                    })
                    .validate(function (output) {
                        if (snmpResponseId) {
                            return output.snmpResponseId === snmpResponseId;
                        } else if (groupId) {
                            return output.groupId === groupId;
                        } else if (endpointId) {
                            return output.endpointId === endpointId;
                        } else {
                            return true;
                        }
                    })
                    .on("data", function (output) {
                        outputs.push(output);
                    })
                    .on("end", function () {
                        const startDateTicks = new Date(startDate).getTime();
                        const endDateTicks = new Date(endDate).getTime();

                        const filteredOutputs = outputs.filter(r => startDateTicks <= r.dateticks && r.dateticks <= endDateTicks);

                        resolve({
                            outputs: filteredOutputs
                        });
                    });
            })
        }
    }
};

module.exports = scriptOutputRepository;