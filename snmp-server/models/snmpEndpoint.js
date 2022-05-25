function SNMPEndpoint(endpoint) {
    return {
        id: endpoint.id
            ? Number(endpoint.id)
            : null,
        friendlyName: endpoint.friendlyName,
        description: endpoint.description,
        oid: Array.isArray(endpoint.oid)
            ? endpoint.oid
            : endpoint.oid.split(',').map(id => Number(id)),
        host: endpoint.host,
        port: Number(endpoint.port),
        community: endpoint.community,
        status: endpoint.status,
        supportGrouping: endpoint.supportGrouping,
        groupingMatch: endpoint.groupingMatch,
        groupingBetween: endpoint.groupingBetween
    };
}

module.exports = SNMPEndpoint;