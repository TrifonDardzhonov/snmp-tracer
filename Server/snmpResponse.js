function SNMPResponse(oid, host, port, community, value, group) {
    this.oid = oid;
    this.host = host;
    this.port = port;
    this.community = community;
    this.value = value;
    this.group = group;
    this.dateticks = new Date().getTime();

    return {
        oid: this.oid,
        host: this.host,
        port: this.port,
        community: this.community,
        value: this.value,
        group: this.group,
        dateticks: this.dateticks
    }
}

module.exports = SNMPResponse;