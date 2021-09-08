module.exports = (commands) => {

    commands.prototype.transfer = async function(id, boost) {
        if (!id || !boost)
            return this.error(`use buyBoost {id} {boost}`);

        const id = this.crypto_list[from_id] || this.crypto_list.find(crypto => crypto.user_id == id);
        if (!id)
            return this.error(`account not found`);

        const crypto = id;
        const response = await crypto.buyBoost(boost);
        if (response.status === 'Успешная покупка')
            return crypto.log(response.status + ', баланс: ' 
                + this.chalk.red.bold(response.balance)
                + ", прибыль: "
                + this.chalk.red.bold(response.mining)
            );
        else
            return crypto.log(response.status + ', баланс: ' 
            + this.chalk.red.bold(await crypto.getBalance()));
    };

};