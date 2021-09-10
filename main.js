//Initialise dependencies and client
global.Discord = require("discord.js"), global.client = new Discord.Client({ intents: [1, 4, 8, 16, 32, 64, 128, 512, 1024, 2048, 4096, 8192, 16384] });
global.files = [require("./config"), require("./commands/bookmark_commands.js"), require("./commands/database.js")];

//Initialise global instance variables
global.main = { interfaces: {}, users: {}};

client.on("messageCreate", (message) => {
  //Argument processing
  var arg = message.content.replace(/ +(?= )/g, "").split(" ");
  if (message.type == "REPLY" && arg[0] == "b/add") addBookmark(message.author.id, [message.reference.channelId, message.reference.guildId, message.reference.messageId], message);

});
