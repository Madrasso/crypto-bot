
module.exports = (commands) => {
    commands.prototype.add = async function(access_token, minBalance) {
        if (!access_token || isNaN(minBalance))
            return this.error(`use add {access_token} {minBalance}`);
        
        access_token.split(':').forEach(async (access_token) => {
            if (access_token.length !== 85)
                return this.error(`invalid access_token length`);

            const crypto = new this.Crypto(9999, access_token);
            if (!(await crypto.getAppParams(true)))
                return;
    
            if (account = (await this.database.accounts.findOne({where: {uid: crypto.user_id, blocked: false}})))  
                return crypto.log('Аккаунт уже есть в базе данных.');

            if (account = (await this.database.accounts.create({access_token, minBalance}))) {
                console.log(
                    this.chalk.cyan.bold(`[${new Date().toISOString()}]`)
                    + this.chalk.red.bold(`[${crypto.user_id}][№${account.id}]`) 
                    + this.chalk` Аккаунт успешно создан`
                );
            }
        });
            
    };

}