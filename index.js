/*
    BOT for vk mini-app "Crypto"
    https://vk.com/app7932067

    Author: madrasso
    https://vk.com/mdx_dev
*/

/*
    v1.0.1
        - Рефакторинг.
        - Добавлен функционал прокси.
        - Добавлена причина не успешной авторизации.
        - Убраны из расчёта очереди невалидные аккаунты.
        - Теперь аккаунты храняться в базе данных sqlite3.
        - Сделана команда добавления аккаунтов через консоль.
        - Сделана команда изменения мин. баланса аккаунта через консоль.
        - Упрощены команды перевода между ботами, заместо {from_id} {to_id} можно писать ид аккаунта в боте.

    v1.0.0
        - release

*/

require('./src/app');