const Crypto        = require('./crypto');
const chalk         = require('chalk');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
  prompt: true
});

const database      = require('./database');
const Commands      = require('./commands');
const settings      = require('./settings.json');

const crypto_list = {};
async function run() {
    await database.init();
    
    const accounts = await database.accounts.findAll({where: {blocked: false}});
    const proxy = await database.proxy.findAll({where: {status: true}});

    async function smartBuy(crypto, account) {
        try {
            let prices = await crypto.getPrices(); account.update({balance: prices.balance});

            if (prices.balance < account.minBalance + prices.recommended.price)
                return 700;

            const response = await crypto.buy(prices.recommended.name)
            if (response.status === 'Успешная покупка')
                crypto.log(`Приобретена валюта << ${chalk.bold.yellow(prices.recommended.name)} >>, прибыль через: ${prices.recommended.willPayOffF.toFixed(1)} мин.`);

            return 5555;
        } catch (e) { console.log(e); }
    }

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        let crypto = crypto_list[account.id];

        if (!crypto) {
            crypto = new Crypto(account.id, account.access_token, proxy[i]);
            if (!(await crypto.getAppParams())) {
                await account.update({blocked: true});
                continue;
            };
            
            crypto_list[account.id] = crypto;
            await account.update({uid: crypto.user_id});
        }

        if (settings.smartBuy) {
            if (!proxy[i]) {
                const delay = await smartBuy(crypto, account);
                await (new Promise(resolve => setTimeout(resolve, delay)));
            } else
                smartBuy(crypto, account);
        }
    }

    setTimeout(run, 5555);
} run();


// console.error = message => console.log(chalk.red.bold(message));
const commands = new Commands({settings, database, chalk, crypto_list, Crypto});
readline.on('line', async (line) => {
    const params = line.split(' ');
    const command = params[0]; params.shift();

    if (!commands[command])
        return console.log(chalk.red.bold('Unknown command'));

    commands[command]( ... params);
});