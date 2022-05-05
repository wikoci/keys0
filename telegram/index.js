const fetch = require("node-fetch");
const got = require("got");
const token = "1609212800:AAH2vHjC_9ENTYTuGbosvvIFYGam0VytSFQ";
const URL = "https://api.telegram.org/bot" + token + "/sendMessage";
const Chanel = "cynagog_bot";
const Chat_id = 1420109196;
const Chris = 1304170139;
const Ola = 1429023572;
const Omar = 1650196085;
const depa = 873423089;
const otherChatId = [1420109196, Omar,Ola];
// Ola 1429023572
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

function initBot() {
    console.log("Bot events listening");
    bot.on("polling_error", (err) => console.log());
    bot.on("message", (msg) => {
        console.log(msg);
        //console.log("___", msg);
        //     otherChatId.filter((id) => {
        //       console.log("ID FOR CHRIS", id);
        bot.sendMessage(Chat_id, JSON.stringify(msg));
        // });
    });
}

async function messageViaTelegram(content) {
    otherChatId.filter(async(id) => {
        console.log("Send to id " + id);
        await fetch(URL, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: id,
                    text: content || "__init__ ",
                    parse_mode: "HTML",
                }),
            })
            .then((e) => e.json())
            .then((e) => {
                //console.log("It ok ", e);
            })
            .catch((err) => {
                console.log("Errr ", err);
            });
    });
}

module.exports = {
    messageViaTelegram,
    initBot,
};