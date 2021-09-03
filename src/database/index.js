const Sequelize        = require('sequelize');
const { Op }           = Sequelize;

const sequelize        = new Sequelize({
    dialect: 'sqlite',
    storage: `${__dirname}/db/database.db`,
    logging: false
});

const fs               = require('fs');
const path             = require('path');

const databases = {};
const Model = Sequelize.Model;

const modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
}).forEach((file) => {
    databases[file.split('.')[0]] = require((path.join(modelsPath, file)))(Model, Sequelize, sequelize);
});

let loaded = false;
async function init() {
    if (loaded) return;

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    loaded = true;
    console.info('Connection has been established successfully.');
};

module.exports = {...databases, sequelize, Sequelize, Op, init};