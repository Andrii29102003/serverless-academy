const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = '';//here mast be your telegram bot token

const bot = new TelegramBot(token, {polling: true});


let chatIds = [1302061744];

const args = process.argv.slice(2);

file = 'chatIds.json';

function loadData() {
    chatIds = JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveData() {
    fs.writeFileSync(file, JSON.stringify(chatIds));
}

bot.onText(/\/start/, (msg) => {
    let chatId = msg.chat.id;

    loadData();

    if (!chatIds.includes(chatId)) {
        chatIds.push(chatId);
    }

    saveData();
 
});

if((args[0] === '--help') || (args[0] === '-h') || (args[0] === 'help')){
    console.log('m - send message to all users');
    console.log('p - send photo to all users');
    console.log('node app.js m "Hello world"');
    console.log('node app.js p "path to photo"');
    process.exit(0);    
}

loadData();


if(args[0] === 'm'){
    chatIds.forEach(id => {
        bot.sendMessage(id, args[1]);
    });
} else if(args[0] === 'p') {
    //send photo by path to all users
    chatIds.forEach(id => {
        bot.sendPhoto(id, args[1]);
    });
    
} else {
    console.log('Wrong command');
}

//exit from program if by 1 seconds
setTimeout(() => {
    process.exit(0);
}, 1000);



