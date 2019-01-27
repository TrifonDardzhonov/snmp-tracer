// chmod 755 swarmReader.sh
// sudo watch -n 5 ./Server/swarmReader.sh
// docker swarm leave --force

const fs = require('fs');
const swarmCommandFile = "swarmCommand.sh";
const swarmHistoryFile = "swarmHistory.txt";

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
    serviceInstances(service).then((instances) => {
        let command = '';
        if (instances === 0) {
            command = swarmAddServiceCommand(service);
        } else {
            command = swarmScalingCommand(service, instances + 1);
        }

        runSwarmCommand(command);
    })
}

function scaleServiceDown(service) {
    serviceInstances(service).then((instances) => {
        if (instances > 1) {
            const command = swarmScalingCommand(service, instances - 1);
            runSwarmCommand(command);
        }
    })
}

function serviceInstances(service) {
    return new Promise((resolve, reject) => {
        fs.readFile(swarmHistoryFile, 'utf8', function (err, command) {
            if (err) throw err;
            const index = command.indexOf(`${service}`);
            if (index !== -1) {
                const indexAfterServiceName = index + service.length;
                const instances = command[indexAfterServiceName] === "="
                    ? command.slice(indexAfterServiceName + 1, command.length)
                    : 1;
                resolve(Number(instances));
            } else {
                resolve(0);
            }
        });
    });
}

function swarmInitCommand() {
    return `docker swarm init --advertise-addr 127.0.0.1:2377`;
}

function swarmAddServiceCommand(service) {
    const dockerImage = "redis:3.0.6" // change this with another image
    return `docker service create --name ${service} ${dockerImage}`
}

function swarmScalingCommand(service, instances) {
    return `docker service scale ${service}=${instances}`;
}

function runSwarmCommand(command) {
    console.log("SWARM COMMAND: ", command);
    fs.writeFile(swarmHistoryFile, command, 'utf8', (err) => {
        if (!err) {
            fs.writeFile(swarmCommandFile, command, 'utf8', (err) => { })
        }
    });
}

module.exports = swarmService;