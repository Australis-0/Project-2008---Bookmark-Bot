//Initialise dependencies and client
global.Discord = require("discord.js"), global.client = new Discord.Client({ intents: [1, 4, 8, 16, 32, 64, 128, 512, 1024, 2048, 4096, 8192, 16384] });
global.files = [require("./config"), require("./commands/bookmark_commands.js"), require("./core/database.js")];
global.Object.filter = (obj, predicate) => Object.keys(obj).filter(key => predicate(obj[key])).reduce((res, key) => (res[key] = obj[key], res), {});

//Initialise global instance variables
global.main = { interfaces: {}, users: {}};

client.on("messageCreate", (message) => {
  //Argument processing
  var arg = message.content.replace(/ +(?= )/g, "").split(" ");
  if (message.type == "REPLY" && arg[0] == "b/add") addBookmark(message.author.id, [message.reference.channelId, message.reference.guildId, message.reference.messageId], message);
  if (message.type == "REPLY" && arg[0] == "b/remove") removeBookmark(message.author.id, message.reference.messageId, message);
});


parseFilters(["b/list", "user:507021242663043082"]);
