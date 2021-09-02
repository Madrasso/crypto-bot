# crypto-bot
"Бот", написанный на Node.JS, для игры ВКонтакте - [Crypto](https://vk.com/app7932067)

# Установка Windows
1. Для начала надо установить [Node.JS](https://nodejs.org/) (установщик для Windows - [Node.js v14.17.6 LTS](https://nodejs.org/dist/v14.17.6/node-v14.17.6-x64.msi)), без этого бот просто не сможет работать.
2. После скачивания и установки Node.JS, скачиваем самого бота нажав на [эту ссылку](https://github.com/Madrasso/crypto-bot/releases/download/latest/crypto-bot.rar).
3. Распаковываем скачанный архив с файлами бота в *любую* папку и заходим в неё.
4. Открываем консоль в директории скрипта (`Shift + ПКМ в папке скрипта -> Открыть окно PowerShell здесь`), вводим `npm i`, после завершения установки библиотек закрываем консоль.
5. После настройки конфига с аккаунтами (`src/config.json`), запускаем файл `start.bat`.

## Как записывать аккаунты config.json
1. Получаем токен аккаунта ВКонтакте, получить его можно [здесь](http://vkhost.github.io/). **Важно!** Нажмите кнопку настроек, выберите все права и после нажимайте получить.
2. Открываем файл `config.json`, после чего между квадратных скобок `[]` пишем: `{"access_token": "**вставляем ваш полученный токен**"}`, если добавляете более одного аккаунта, пишем запятую после фигурной скобки и пишем тоже самое. [Пример конфига.](#пример-конфига)
3. Сохраняем, запускаем `start.bat`, если аккаунты авторизуются успешно - радуемся!

### Пример конфига
```json
[
    {"access_token": "2f2872231aea2056a1913ebba1235c369a7a3d08ff0837d48390833b9f"},
    {"access_token": "955c8111c6962aa5f502e45654e0084e5b2e122fb393bfd59c1022de"},
    {"access_token": "cb123a61287645ee1ffc3758cde91235849b618cb7ce03ca424e609"}
]
```

### Доступные команды для использования через запущенную консоль
| Команда    	| Описание                                                							|
|---------------|-----------------------------------------------------------------------------------|
|  help         | Вывести в консоль список актуальных команд  				    					|
| stats    		| Вывести статистику авторизованных аккаунтов           						    |
| transfer    	| Перевести крипту (transfer `ид переводчика` `ид получателя` `сумма перевода`)     |
| transferAll  	| Перевести крипту со всех ботов (transfer `ид получателя` `сумма перевода`)        |
