var fs = require('fs');

var snmpRepository = function () {
    const filePath = 'db.json';
    return {
        write: function (jsonData) {
            fs.appendFile(filePath, JSON.stringify(jsonData) + '\r\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }
}

module.exports = snmpRepository;