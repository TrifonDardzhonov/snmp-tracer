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
    serviceInstances().then((instances) => {
        const command = swarmScalingCommand(service, instances + 1);
        runSwarmCommand(command);
    })
}

function scaleServiceDown(service) {
    serviceInstances(service).then((instances) => {
        const command = swarmScalingCommand(service, instances - 1);
        runSwarmCommand(command);
    })
}

function serviceInstances(service) {
    return new Promise((resolve, reject) => {
        fs.readFile(swarmHistoryFile, 'utf8', function (err, command) {
            if (err) throw err;
            const index = command.lastIndexOf(`${service}=`);
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
    return `-c "docker swarm init --advertise-addr 127.0.0.1:2377"`;
}

function swarmScalingCommand(service, instances) {
    return `docker service scale ${service}=${instances}`;
}

function runSwarmCommand(command) {
    fs.writeFile(swarmHistoryFile, command, 'utf8', (err) => {
        if (!err) {
            fs.writeFile(swarmCommandFile, command, 'utf8', (err) => { })
            // chmod 755 swarmReader.sh
            // sudo watch -n 5 ./Server/swarmReader.sh
        }
    });
}

module.exports = swarmService;