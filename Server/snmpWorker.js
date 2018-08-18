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
        config.nodes.forEach((node) => {
            extractSubtree(node).then(varbinds => {
                if (varbinds) {
                    varbinds.forEach(bind => {
                        var snmpResponse = SNMPResponse(node.oid, node.host, node.port, node.community, bind.value);
                        snmpRepository.write(snmpResponse);
                    });
                }
            });
        })
    });
}

function extractSubtree(node) {
    var session = new snmp.Session({
        host: node.host,
        port: node.port,
        community: node.community
    });

    return new Promise((resolve, reject) => {
        session.getSubtree({
            oid: node.oid
        }, function (error, varbinds) {
            if (error) {
                console.log('Fail :(');
            } else {
                console.log(varbinds, ' for ', node);
                resolve(varbinds);
            }
        });
    })
}

var snmpWorker = function () {
    return {
        start: visitNodes,
        test: extractSubtree
    }
}

module.exports = snmpWorker;