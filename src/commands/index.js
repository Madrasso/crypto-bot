function Commands({settings, database, chalk, crypto_list, Crypto}) {
    this.chalk = chalk;
    this.Crypto = Crypto;
    this.settings = settings;
    this.database = database;
    this.crypto_list = crypto_list;
    this.error = error = message => console.log(chalk.red.bold(message));
};

const fs            = require('fs');
const path          = require('path');

fs.readdirSync(__dirname).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
}).forEach((file) => { 
    require((path.join(__dirname, file)))(Commands)
});

module.exports = Commands;