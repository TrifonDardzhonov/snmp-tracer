function SNMPResponse(
    endpointId,
    oid,
    host,
    port,
    community,
    value,
    groupId,
    group) {
    return {
        endpointId: endpointId,
        oid: oid,
        host: host,
        port: port,
        community: community,
        value: value,
        groupId: groupId,
        group: group,
        dateticks: new Date().getTime()
    };
}

module.exports = SNMPResponse;