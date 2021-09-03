const axios = require('axios');
const chalk = require('chalk');

module.exports = class Crypto {

    constructor(id, access_token, proxy) {
        if (!access_token)
            throw new Error('access_token not specified');

        this.id = id;
        this.proxy = proxy;
        this.access_token = access_token;
    }

    async request(method = '', params = {}) {
        try {
            return await axios(`https://baguette-game.com:1000/${method}`, {
                method: "POST", headers: {'Content-Type': 'application/json'},
                data: {params: this.params, id: params.id || this.user_id, ... params},
                proxy: this.proxy ? {protocol: this.proxy.protocol, host: this.proxy.host, port: this.proxy.port} : false,
            }).then(response => response.data);
        } catch(e) {
            console.log(e);
        }
    }

    async getAppParams(bool) {
        const params = await axios(`https://api.vk.com/method/apps.get?access_token=${this.access_token}&v=5.131&app_id=7932067&platform=web`, {
            proxy: this.proxy ? {protocol: this.proxy.protocol, host: this.proxy.host, port: this.proxy.port} : false,
        });
        
        if (!params?.data?.response?.items[0].webview_url) {
            this.log('Не удалось авторизоваться.', params?.data?.error?.error_msg);
            return false;
        }

        this.params = params.data.response.items[0].webview_url.match(/index\.html\?(.*)/)[1];
        this.user_id = this.params.match(/vk_user_id=(\d+)/)[1];

        if (!bool) this.log('Аккаунт успешно авторизован.');
        return true;
    }

    async getStats() {
        return this.request();
    }

    async getBalance() {
        return (await this.request('GetUserBalance')).balance;
    }

    getCrypts() {
        return [
            {name: 'Bitcoin', crypt_id: 'bitcoin', booty: 1, price: 100},
            {name: 'Ethereum', crypt_id: 'ethereum', booty: 5, price: 150},
            {name: 'Cardano', crypt_id: 'cardano', booty: 10, price: 225},
            {name: 'BinanceCoin', crypt_id: 'binanceCoin', booty: 15, price: 340},
            {name: 'Tether', crypt_id: 'tether', booty: 20, price: 500},
            {name: 'XRP', crypt_id: 'xrp', booty: 30, price: 760},
            {name: 'Dogecoin', crypt_id: 'dogecoin', booty: 40, price: 1140},
            {name: 'Polkadot', crypt_id: 'polkadot', booty: 50, price: 1710},
            {name: 'USD', crypt_id: 'usdCoin', booty: 60, price: 2560},
            {name: 'Solana', crypt_id: 'solana', booty: 80, price: 4000},
            {name: 'Uniswap', crypt_id: 'uniswap', booty: 110, price: 6000},
            {name: 'Chaincoin', crypt_id: 'chaincoin', booty: 150, price: 9000},
            {name: 'Terra', crypt_id: 'terra', booty: 200, price: 13500},
            {name: 'Litecoin', crypt_id: 'litecoin', booty: 250, price: 20000},
            {name: 'Filecoin', crypt_id: 'filecoin', booty: 300, price: 30000},
        ];
    }

    async getPrices() {
        const stats = await this.getStats();
        const crypts = this.getCrypts();

        let recommended = {willPayOff: 9999, willPayOffF: 9999};
        for (let i = 0; i < crypts.length; i++) {
            crypts[i].price = crypts[i].price * (2 ** stats[crypts[i].crypt_id]);
            crypts[i].willPayOff = crypts[i].price / crypts[i].booty;
            crypts[i].willPayOffF = crypts[i].price / (stats.in_minute_mining + crypts[i].booty);

            if (recommended.willPayOff > crypts[i].willPayOff)
                recommended = crypts[i];
        };

        if ([0, 1].includes(stats.in_minute_mining))
            recommended = crypts[stats.in_minute_mining];

        this.recommendedPrice = recommended.price;
        return {balance: stats.balance, crypts, recommended};
    }

    async buy(crypt) {
        if (!crypt)
            throw new Error('crypt name not specified');

        return this.request(`BuyUpgrade${crypt}`);
    }

    async transfer(amount, recipient_id) {
        if (!amount) 
            throw new Error('amount not specified');

        if (!recipient_id) 
            throw new Error('recipient_id not specified');

        return this.request('Transfer', {amount, recipient_id});
    }

    log() {
        console.log(
            chalk.cyan.bold(`[${new Date().toISOString()}]`)
            + chalk.red.bold(`[${this.user_id}]${this.id !== undefined ? `[№${this.id}]` : ``}`), 
            ... arguments
        );
    }
};