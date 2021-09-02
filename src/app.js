const Crypto = require('./crypto');
const chalk = require('chalk');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const accounts = []; // ? more coming soon..
const config = require('./config.json');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function start(account) {
    account.minAutoBuyBalance = account.minAutoBuyBalance || 0;

    const crypto = new Crypto(account.access_token, accounts.length);
    accounts.push({crypto, config: account}); 

    if (!(await crypto.getAppParams()))
        return;

    async function autoBuy() {
        try {
            let prices = await crypto.getPrices();

            if (prices.balance >= account.minAutoBuyBalance && prices.balance >= prices.recommended.price) {
                const response = await crypto.buy(prices.recommended.name)
                if (response.status === 'Успешная покупка')
                    crypto.log(
                        `Приобретена валюта << ${chalk.bold.yellow(prices.recommended.name)} >>, прибыль ожидается через: ${prices.recommended.willPayOff.toFixed(1)} мин.`
                    );
            }
        } catch (e) { console.log(e); }
        setTimeout(autoBuy, config.length * 7000); // ? too many request...
    }; 
    await autoBuy();
}; 

console.error = message => console.log(chalk.red.bold(message));
readline.on('line', async (line) => {
    const params = line.split(' ');
    const command = params[0]; params.shift();

    switch (command) {
        case 'help': 
            console.log(chalk`
        Available commands:

            {cyan.bold stats}
            {cyan.bold transfer} \{from_id\} \{to_id\} \{ammount\}
            {cyan.bold transferAll} \{to_id\} \{ammount\}
            `)
            break;

        case 'stats': 
            console.log();
            for (let i = 0; i < accounts.length; i++) {
                const crypto = accounts[i].crypto;
                const stats = await crypto.getStats();
                crypto.log(chalk`Крипты: {red.bold ${stats.sum}}; Прибыль: {red.bold ${stats.in_minute_mining}}; Баланс: {red.bold ${stats.balance}}; Рекоммендованая покупка: {red.bold ${crypto.recommendedPrice}};`);
            }
            console.log();
            break;

        case 'transfer':
            if (!params[0] || !params[1] || !params[2])
                return console.error(`use transfer {from_id} {to_id} {amount}`);

            const account = accounts.find(account => account.crypto.user_id == params[0]);
            if (!account)
                return console.error(`account not found`);

            const crypto = account.crypto;
            const response = await crypto.transfer(params[2], params[1]);
            if (response.status === 'Перевод был совершен')
                return crypto.log('Перевод выполнен успешно, баланс: ' 
                    + chalk.red.bold(response.balance));

            if (response.status === 'Недостаточно средств') {
                return crypto.log('Недостаточно средств для перевода, баланс: ' 
                + chalk.red.bold(await crypto.getBalance()));
            }

            break;

        case 'transferAll':
            if (!params[0] || !params[1])
                return console.error(`use transfer {to_id} {amount}`);

            for (let i = 0; i < accounts.length; i++) {
                const crypto = accounts[i].crypto;
                if (crypto.user_id == params[0]) continue;

                const response = await crypto.transfer(params[1], params[0]);
                if (response.status === 'Перевод был совершен')
                    crypto.log('Перевод выполнен успешно, баланс: ' 
                        + chalk.red.bold(response.balance));
    
                if (response.status === 'Недостаточно средств') {
                    crypto.log('Недостаточно средств для перевода, баланс: ' 
                    + chalk.red.bold(await crypto.getBalance()));
                }

                await wait(5000); // ? too many request...
            }

            break;
        default:
            console.log(chalk.red.bold('Unknown command'));
    }
});


(async () => {
    console.clear();
    if (config.length === 0)
        throw new Error('no accounts in config.json');

    for (let i = 0; i < config.length; i++) {
        await start(config[i]);
        await wait(5000); // ? too many request...
    }
})();