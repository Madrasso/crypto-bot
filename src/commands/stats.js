const PrettyTable = require('prettytable');

module.exports = (commands) => {
    
    commands.prototype.stats = async function() {
        let table = this.settings.style == "table" ? new PrettyTable() : "";

        if (this.settings.style == "table")
            table.fieldNames(["ID", "USER ID", "BALANCE", "CRYPTS", "PROFIT", "REC. BUY"]);

        console.log();
        for (const id in this.crypto_list) {
            const crypto = this.crypto_list[id];
            const stats = await crypto.getStats();

            if (this.settings.style == "table")
                table.addRow([crypto.id, crypto.user_id, stats.balance.toLocaleString(), stats.sum.toLocaleString(), stats.in_minute_mining.toLocaleString(), crypto.recommendedPrice.toLocaleString()])
            else table += this.chalk.red.bold(`[${crypto.user_id}][№${crypto.id}] `) + this.chalk`Крипты: {red.bold ${stats.sum.toLocaleString()}}; Прибыль: {red.bold ${stats.in_minute_mining.toLocaleString()}}; Баланс: {red.bold ${stats.balance.toLocaleString()}}; Рекоммендованая покупка: {red.bold ${crypto.recommendedPrice.toLocaleString()}};\n`;
        }

        if (this.settings.style == "table")
            table.print();
        else console.log(table);
            
        console.log();
    };

}