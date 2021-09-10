//Initialise dependencies and client
global.Discord = require("discord.js");
global.client = new Discord.Client({ intents: [1, 4, 8, 16, 32, 64, 128, 512, 1024, 2048, 4096, 8192, 16384] });
global.login = require("./config");

//Initialise global instance variables
var main = { interfaces: {}, users: {}};

client.on("messageCreate", (message) => {
  //Argument processing
  var arg = message.content.replace(/ +(?= )/g, "").split(" ");
  console.log(message);
});
