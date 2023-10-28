const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const fs = require('fs');


const apiKey = "01767cd7f300e35d8433c5d83e3695c4"
const city = "Vinnytsia";
const generalURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
const frequencyOfCheck = 1000; //10 min = 600000 ms

const bot = new TelegramBot("6756857724:AAEtGxLZoyKTy4JsUid9aBSAQnhMtyl9F7k", {polling: true});
var usersDB = [];
const usersDBFileName = "usersDB.json";
//create file if not exists
try{
    usersDB = JSON.parse(fs.readFileSync(usersDBFileName));
} catch (error) {
    fs.writeFileSync(usersDBFileName, JSON.stringify(usersDB));
}


//button for chos each 4 hours or each 6 hours (hours*3600000)
const options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '4 hours', callback_data: 4*20000 }],
            [{ text: '6 hours', callback_data: 6*20000 }],
        ]
    })
};


async function getWeather() {
    try{
        const response = await axios.get(generalURL);
        data = {};
        data.weather = response.data.list[1].weather[0].description;
        data.temp = response.data.list[1].main.temp;
        data.wind = response.data.list[1].wind.speed;
        return data;
    } catch (error) {
        console.log("Error in getWeather():",error);
        data.weather = "Error";
        return data;
    }
}



//if "/start" bot command is received add user to DB
bot.onText(/\/start/, (msg) => {
    console.log("start command received");//DEL
    //add options to bot
    bot.sendMessage(msg.chat.id, "Choose frequency of weather send", options);
});
bot.on("callback_query", function (msg) {
    bot.sendMessage(callbackQuery.message.chat.id, "You have chosen " + msg.data);
    bot.answerCallbackQuery(msg.id, "You have chosen " + msg.data);
    const selectedOption = msg.data;
    const chatId = msg.chat.id;
    user = {};
    user.chatId = chatId;
    user.selectedOption = selectedOption;
    user.sendTime = Date.now() + selectedOption;

    //load usersDB from file
    usersDB = JSON.parse(fs.readFileSync(usersDBFileName));
    //if user exists in DB remove him
    usersDB = usersDB.filter(user => user.chatId !== chatId);
    //add user to DB
    usersDB.push(user);
    //save DB to file
    fs.writeFileSync(usersDBFileName, JSON.stringify(usersDB));

    console.log("usersDB ", usersDB);//DEL
});


async function sendForecast(){
    //load usersDB from file
    usersDB = JSON.parse(fs.readFileSync(usersDBFileName));

    //check if it is time to send weather
    usersDB.forEach(async (user) => {
        if(Date.now() >= user.sendTime){
            //send weather
            data = await getWeather();
            bot.sendMessage(user.chatId, `Weather: ${data.weather}\nTemperature: ${data.temp}\nWind: ${data.wind}`);
            //update sendTime
            user.sendTime = Date.now() + user.selectedOption;
        }
    });

    //save DB to file
    fs.writeFileSync(usersDBFileName, JSON.stringify(usersDB));

    //set timeout for next check
    setTimeout(sendForecast, frequencyOfCheck);

}

//start sending forecast
sendForecast();
console.log("Bot started");//DEL

