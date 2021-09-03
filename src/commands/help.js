module.exports = (commands) => {

    commands.prototype.help = async function() {
        console.log(this.chalk`
        Available commands:

            {cyan.bold stats}
            {cyan.bold transfer} \{from_id\} \{to_id\} \{ammount\}
            {cyan.bold transferAll} \{to_id\} \{ammount\}

            {cyan.bold add} \{access_token\} - adding account
            {cyan.bold minBalance} \{minBalance\} - adding account
        `);
    };

}