var fs = require('fs');

fs.readFile('correct.txt', 'utf8', function (err, respondedCommand) {
    const cutFrom = respondedCommand.indexOf("docker swarm join");
    let cutTo = respondedCommand.indexOf("To add a manager to this swarm");
    const foundCommand = (respondedCommand.substring(cutFrom, cutTo - 2)) //2 empty lines
    console.log(foundCommand);
    fs.writeFile('joinNodes.sh', foundCommand, (err) => console.log(err))
});