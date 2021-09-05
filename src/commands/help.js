module.exports = (commands) => {

    commands.prototype.help = async function() {
        console.log(this.chalk`
        Available commands:

            {cyan.bold stats}
            {cyan.bold transfer} \{from_id\} \{to_id\} \{amount\}
            {cyan.bold transferAll} \{to_id\} \{amount\}
            {cyan.bold autoTransfer} \{to_id\} \{amount\} \{interval in min\}
            {cyan.bold smartBuy}

            {cyan.bold add} \{access_token\} - adding account
            {cyan.bold minBalance} \{account_id\} \{minBalance\}
        `);
    };

}