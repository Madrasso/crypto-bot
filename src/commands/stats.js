const PrettyTable = require('prettytable');

module.exports = (commands) => {
    
    commands.prototype.stats = async function(style) {
        this.settings.style = style || "string";
        let table = this.settings.style == "table" ? new PrettyTable() : "";

        if (this.settings.style == "table")
            table.fieldNames(["ID", "USER ID", "BALANCE", "CRYPTS", "PROFIT", "REC. BUY"]);

        const statistics = {accounts: 0, balance: 0, crypts: 0, profit: 0}
        for (const id in this.crypto_list) {
            const crypto = this.crypto_list[id];
            const stats = await crypto.getStats();

            statistics.accounts++;
            statistics.crypts += stats?.sum;
            statistics.balance += stats?.balance;
            statistics.profit += stats?.in_minute_mining;

            if (!stats.sum) console.log(stats);

            if (this.settings.style == "table")
                table.addRow([crypto.id, crypto.user_id, stats.balance.toLocaleString(), stats.sum.toLocaleString(), stats.in_minute_mining.toLocaleString(), String(crypto.recommendedPrice).toLocaleString()])
            else table += this.chalk.red.bold(`[${crypto.user_id}][№${crypto.id}] `) + this.chalk`Крипты: {red.bold ${stats.sum.toLocaleString()}}; Прибыль: {red.bold ${stats.in_minute_mining.toLocaleString()}}; Баланс: {red.bold ${stats.balance.toLocaleString()}}; Рекоммендованая покупка: {red.bold ${String(crypto.recommendedPrice).toLocaleString()}};\n`;
        }
        
        console.log();
        if (this.settings.style == "table") {
            table.addRow([statistics.accounts, "Общая статистика", statistics.balance.toLocaleString(), statistics.crypts.toLocaleString(), statistics.profit.toLocaleString(), 0])
            table.print();
        } else { 
            table += "\n" 
                + this.chalk`{red.bold [Общая статистика]} `
                + this.chalk`Аккаунтов: {red.bold ${statistics.accounts}}; `
                + this.chalk`Баланс: {red.bold ${statistics.balance.toLocaleString()}}; `
                + this.chalk`Прибыль: {red.bold ${statistics.profit.toLocaleString()}}; `
                + this.chalk`Крипты: {red.bold ${statistics.crypts.toLocaleString()}}; `

            console.log(table);
        } console.log();
    };

}