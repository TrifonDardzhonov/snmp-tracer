function SNMPEndpoint(friendlyName, oid, host, port, community, supportGrouping) {
    this.friendlyName = friendlyName;
    this.oid = oid;
    this.host = host;
    this.port = port;
    this.community = community;
    this.supportGrouping = supportGrouping;

    return {
        friendlyName: this.friendlyName,
        oid: this.oid,
        host: this.host,
        port: this.port,
        community: this.community,
        supportGrouping: this.supportGrouping
    }
}

module.exports = SNMPEndpoint;