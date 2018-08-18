function SNMPResponse(oid, host, port, community, value) {
    this.oid = oid;
    this.host = host;
    this.port = port;
    this.community = community;
    this.value = value;

    return {
        oid: this.oid,
        host: this.host,
        port: this.port,
        community: this.community,
        value: this.value
    }
}

module.exports = SNMPResponse;
