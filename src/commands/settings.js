module.exports = (commands) => {
    commands.prototype.minBalance = async function(account_id, minBalance) {
        if (!this.crypto_list[account_id] || isNaN(minBalance))
            return this.error(`use minBalance {account_id} {minBalance}`);
        
        await this.database.accounts.update({minBalance}, {where: {id: account_id}});
        this.crypto_list[account_id].log(this.chalk`Минимальный баланс изменён на {red.bold ${minBalance}}`);
        
    };

}