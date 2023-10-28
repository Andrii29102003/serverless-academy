const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;


const apiKey = "01767cd7f300e35d8433c5d83e3695c4"
const city = "Vinnytsia";
const generalURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
//const generalURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&units=metric&cnt=1&appid=${apiKey}`


async function getWeather() {
    try{
        const response = await axios.get(generalURL);
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}


getWeather();


