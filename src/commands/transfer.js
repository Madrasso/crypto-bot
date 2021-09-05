module.exports = (commands) => {

    commands.prototype.transfer = async function(from_id, to_id, amount) {
        if (!from_id || !to_id || !amount)
            return this.error(`use transfer {from_id} {to_id} {amount}`);

        const recipient = this.crypto_list[to_id]?.user_id || to_id; 
        const translator = this.crypto_list[from_id] || this.crypto_list.find(crypto => crypto.user_id == from_id);
        if (!translator)
            return this.error(`translator account not found`);

        const crypto = translator;
        const response = await crypto.transfer(amount, recipient);
        if (response.status === 'Перевод был совершен')
            return crypto.log('Перевод выполнен успешно, баланс: ' 
                + this.chalk.red.bold(response.balance));

        if (response.status === 'Недостаточно средств') {
            return crypto.log('Недостаточно средств для перевода, баланс: ' 
            + this.chalk.red.bold(await crypto.getBalance()));
        }
    };

    commands.prototype.transferAll = async function(to_id, amount) {
        if (!to_id || !amount)
            return this.error(`use transferAll {to_id} {amount}`);

        const recipient = this.crypto_list[to_id]?.user_id || to_id; 
        for (const i in this.crypto_list) {
            const crypto = this.crypto_list[i];
            if (crypto.user_id == recipient) continue;

            const response = await crypto.transfer(amount, recipient);
            if (response.status === 'Перевод был совершен')
                crypto.log('Перевод выполнен успешно, баланс: ' 
                    + this.chalk.red.bold(response.balance));

            if (response.status === 'Недостаточно средств') {
                crypto.log('Недостаточно средств для перевода, баланс: ' 
                + this.chalk.red.bold(await crypto.getBalance()));
            }

            if (!crypto.proxy)
                await (new Promise(resolve => setTimeout(resolve, 1111))); // ? too many request...
        }
    };

    commands.prototype.autoTransfer = async function(to_id, amount, interval) {
        if (!to_id || !amount || !interval)
            return this.error(`use autoTransfer {to_id} {amount} {interval}`);

        setInterval(this.transferAll, Number(interval) * 60 * 1000, to_id, amount);
    }

}