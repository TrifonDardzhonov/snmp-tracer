var SNMPResponse = require('./snmpResponse');
var snmpRepository = require('./snmpRepository');
var snmp = require('snmp-native');

var snmpRepository = snmpRepository();

function visitNodes() {
    visitEachNode();
    setTimeout(visitNodes, seconds(10));
}

function seconds(sec) {
    return sec * 1000;
}

function visitEachNode() {
    var fs = require('fs');
    var config;
    fs.readFile('config.json', 'utf8', function (err, data) {
        if (err) throw err;
        config = JSON.parse(data);
        config.nodex.forEach((node) => {
            extractSubtree(node);
        })
    });
}

function extractSubtree(node) {
    var session = new snmp.Session({
        host: node.host,
        port: node.port,
        community: node.community
    });

    session.getSubtree({
        oid: node.oid
    }, function (error, varbinds) {
        if (error) {
            console.log('Fail :(');
        } else {
            varbinds.forEach(bind => {
                var snmpResponse = SNMPResponse(node.oid, node.host, node.port, node.community, bind.value);
                snmpRepository.write(snmpResponse);
            });
        }
    });
}

visitNodes();