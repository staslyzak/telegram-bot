//documention https://github.com/yagop/node-telegram-bot-api

const TelegramBot = require('node-telegram-bot-api');
const db = require('./db/db');
const http = require('http');
const https = require('https');

http.createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
});
setInterval(function(){
    https.get('https://telegram-bot-collio.herokuapp.com/')
},300000);


const token = '648007077:AAEytiRIimnFY3Ou3O98zYrE8OI85_G2V5k';

const bot = new TelegramBot(token, {polling: true});


const sendNotification = async (text) => {
  const users = (await db.getUsers()).map(item=>item.userId);
  console.log(users);
  users.forEach(item=>bot.sendMessage(item,text));
};

// bot.on('message', (msg) => {
//   const DATE = new Date(msg.date * 1000);
//   const chatId = msg.chat.id;
  
//   let receivedHours = parseInt(parseInt(DATE.getHours() + 2));

//   if(receivedHours < 10 ) receivedHours = `0${parseInt(DATE.getHours() + 2)}`;
//   if(receivedHours > 24 ) receivedHours = `0${parseInt(DATE.getHours() + 2) - 24}`; 

//   let receivedMinutes = (parseInt(DATE.getMinutes()) < 10) ? `0${parseInt(DATE.getMinutes())}` : parseInt(DATE.getMinutes());
//   let receivedSeconds = (parseInt(DATE.getSeconds()) < 10) ? `0${parseInt(DATE.getSeconds())}` : parseInt(DATE.getSeconds());

//   console.log(msg);

//   bot.sendMessage(chatId, `What's up at ${receivedHours}:${receivedMinutes}:${receivedSeconds}`);
// });
const deadline = 1552417200;

// functionality of showing time remaining before the deadline hh:mm:ss
const needZero = num => num > 9 ? `${num}` : `0${num}`;
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    switch (msg.text) {
        // TODO: add command addNotification, will work only with adminId
        //    TODO: add test coverage
        case '/start':
            await db.addUser(chatId);
            bot.sendMessage(chatId,'Welcome! list of all commands: \/deadline');
            break;
        case '/deadline':
            console.log(msg);
            const time = new Date(msg.date * 1000);
            const hours = needZero(parseInt((deadline - msg.date) / 3600));
            const mins = needZero(parseInt((deadline - msg.date) % 3600 / 60));
            const sec = needZero(parseInt((deadline - msg.date) % 60));
            bot.sendMessage(chatId, `Time left ${hours}:${mins}:${sec}`);
            break;
        default:
            bot.sendMessage(chatId, `hello`);
    }
});