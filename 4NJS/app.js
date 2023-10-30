const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const fs = require('fs');


const apiKey = "" //weather API key
const city = "Vinnytsia";
const generalURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
const frequencyOfCheck = 600000; //10 min = 600000 ms

const telegramAPIKey = ""; //telegram API key
const bot = new TelegramBot(telegramAPIKey, {polling: true});
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
    "reply_markup": {
        "keyboard": [["4 hours"], ["6 hours"]]
    }
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
    //add options to bot
    bot.sendMessage(msg.chat.id, "Choose how often you want to receive weather forecast:", options);
});

bot.on('message', function (msg) {
    if(msg.text === "4 hours"){
        var user = {};
        user.chatId = msg.chat.id;
        user.selectedOption = 4*3600000;
        user.sendTime = Date.now() + user.selectedOption;
        //load usersDB from file
        usersDB = JSON.parse(fs.readFileSync(usersDBFileName));
        //if user exists in DB remove him
        usersDB = usersDB.filter(userIterator => userIterator.chatId !== user.chatId);
        //add user to DB
        usersDB.push(user);
        //save DB to file
        fs.writeFileSync(usersDBFileName, JSON.stringify(usersDB));
        bot.sendMessage(msg.chat.id, "You will receive weather forecast every 4 hours");
    }
    if(msg.text === "6 hours"){
        user = {};
        user.chatId = msg.chat.id;
        user.selectedOption = 6*3600000;
        user.sendTime = Date.now() + user.selectedOption;
        //load usersDB from file
        usersDB = JSON.parse(fs.readFileSync(usersDBFileName));
        //if user exists in DB remove him
        usersDB = usersDB.filter(userIterator => userIterator.chatId !== user.chatId);
        //add user to DB
        usersDB.push(user);
        //save DB to file
        fs.writeFileSync(usersDBFileName, JSON.stringify(usersDB));
        bot.sendMessage(msg.chat.id, "You will receive weather forecast every 6 hours");
    }
    console.log("usersDB:", usersDB);//DEL
    console.log("NOW =", Date(Date.now()));//DEL
    for(userI of usersDB){
        console.log("user.chatId", userI.chatId, "sendTime =", Date(userI.sendTime));//DEL
    }
});


async function sendForecast(){
    //load usersDB from file
    usersDB = JSON.parse(fs.readFileSync(usersDBFileName));

    //check if it is time to send weather
    for (let user of usersDB) {
        if(Date.now() >= user.sendTime){
            //send weather
            data = await getWeather();
            bot.sendMessage(user.chatId, `Weather: ${data.weather}\nTemperature: ${data.temp}\nWind: ${data.wind}`);
            //update sendTime
            user.sendTime = Date.now() + user.selectedOption;
            //convert time is seconds to uts


            console.log("user.chatId", user.chatId, "NOW =", Date(Date.now()), "||", Date.now(), "new sendTime =", user.sendTime);//DEL
            
        }
    }

    //save DB to file
    fs.writeFileSync(usersDBFileName, JSON.stringify(usersDB));

    //set timeout for next check
    setTimeout(sendForecast, frequencyOfCheck);

}

bot.on("polling_error", console.log);

//start sending forecast
sendForecast();
console.log("Bot started");//DEL

