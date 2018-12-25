const fs = require('fs');
const shell = require('shelljs');
const swarmFile = "swarm.sh";

function swarmService() {
    return {
        init() {
            shell.exec(`docker swarm init --advertise-addr localhost:2377`);
        },
        scaleUp(service) {
            scaleServiceUp(service);
        },
        scaleDown(service) {
            scaleServiceDown(service);
        }
    }
}

function scaleServiceUp(service) {
    serviceInstances().then((instances) => {
        const command = buildSwarmCommand(service, Number(instances) + 1);
        fs.writeFile(swarmFile, command, 'utf8', (err) => {
            if (!err) {
                execSwarmFile();
            }
        });
    })
}

function scaleServiceDown(service) {
    serviceInstances().then((instances) => {
        const command = buildSwarmCommand(service, Number(instances) - 1);
        fs.writeFile(swarmFile, command, 'utf8', (err) => {
            if (!err) {
                execSwarmFile();
            }
        });
    })
}

function serviceInstances() {
    return new Promise((resolve, reject) => {
        fs.readFile(swarmFile, 'utf8', function (err, command) {
            if (err) throw err;
            const index = command.lastIndexOf("=");
            const instances = command.slice(index + 1, command.length);
            resolve(instances);
        });
    });
}

function buildSwarmCommand(service, instances) {
    const command = `docker service scale ${service}=${instances}`;
    return command;
}

function execSwarmFile() {
    shell.exec(`chmod 755 ${swarmFile}`);
    shell.exec(`./${swarmFile}`);
}

module.exports = swarmService;