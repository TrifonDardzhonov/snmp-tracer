function ScriptOutput(
    snmpResponseId,
    endpointId,
    groupId,
    script,
    output) {
    return {
        snmpResponseId: snmpResponseId,
        endpointId: endpointId,
        groupId: groupId,
        script: script,
        text: output,
        dateticks: new Date().getTime()
    };
}

module.exports = ScriptOutput;