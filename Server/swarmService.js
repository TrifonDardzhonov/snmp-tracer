const fs = require('fs');
const shell = require('shelljs');
const swarmFile = "swarm.sh";

function swarmService() {
    return {
        init() {
            initSwarm();
        },
        scaleUp(service) {
            scaleServiceUp(service);
        },
        scaleDown(service) {
            scaleServiceDown(service);
        }
    }
}

function initSwarm() {
    const command = swarmInitCommand();
    runSwarmCommand(command);
}

function scaleServiceUp(service) {
    serviceInstances().then((instances) => {
        const command = swarmScalingCommand(service, instances + 1);
        runSwarmCommand(command);
    })
}

function scaleServiceDown(service) {
    serviceInstances().then((instances) => {
        const command = swarmScalingCommand(service, instances - 1);
        runSwarmCommand(command);
    })
}

function serviceInstances() {
    return new Promise((resolve, reject) => {
        fs.readFile(swarmFile, 'utf8', function (err, command) {
            if (err) throw err;
            const index = command.lastIndexOf("=");
            if (index !== -1) {
                const instances = command.slice(index + 1, command.length);
                resolve(Number(instances));
            } else {
                resolve(1);
            }
        });
    });
}

function swarmInitCommand() {
    return `docker swarm init --advertise-addr 127.0.0.1:2377`;
}

function swarmScalingCommand(service, instances) {
    return `docker service scale ${service}=${instances}`;
}

function runSwarmCommand(command) {
    fs.writeFile(swarmFile, command, 'utf8', (err) => {
        if (!err) {
            execSwarmFile();
        }
    });
}

function execSwarmFile() {
    shell.exec(`chmod 755 ${swarmFile}`);
    shell.exec(`./${swarmFile}`);
}

module.exports = swarmService;