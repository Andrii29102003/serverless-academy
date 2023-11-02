const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TelegramAPIKey = ''; // Telegram API Key
const BankAPIURL = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';
const options = {
    reply_markup: {
        keyboard: [
            [{ text: "USD"}, { text: "EUR"}]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};


const bot = new TelegramBot(TelegramAPIKey, {polling: true});


async function getExchangeRates(currency) {
    const serverResponse = await axios.get(BankAPIURL);
    let ansver = null;
    for(let currenciVal of serverResponse.data) {
        if(currenciVal.ccy == currency) {
            ansver = currenciVal;
        }
    }
    return ansver;
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Switch USD or EUR', options);
});

bot.onText(/(.+)/, (msg) => {
    if(msg.text == 'USD') {
        getExchangeRates('USD')
            .then((response) => {
                bot.sendMessage(msg.chat.id, `Currency: ${response.ccy}\nBuy: ${response.buy}\nSale: ${response.sale}`);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if(msg.text == 'EUR') {
        getExchangeRates('EUR')
            .then((response) => {
                bot.sendMessage(msg.chat.id, `Currency: ${response.ccy}\nBuy: ${response.buy}\nSale: ${response.sale}`);
            })
            .catch((error) => {
                console.log(error);
            });
    }
});




bot.on("polling_error", console.log);