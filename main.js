//Initialise dependencies and client
global.Discord = require("discord.js"), global.client = new Discord.Client({ intents: [1, 4, 8, 16, 32, 64, 128, 512, 1024, 2048, 4096, 8192, 16384] });
global.fs = require("fs");
global.files = [require("./config"), require("./commands/bookmark_commands.js"), require("./core/database.js")];
global.Object.filter = (obj, predicate) => Object.keys(obj).filter(key => predicate(obj[key])).reduce((res, key) => (res[key] = obj[key], res), {});

//Initialise global instance variables
global.commands = 6, global.main = { interfaces: {}, users: {}};

client.on("messageReactionAdd", async (reaction, user) => {
  var m = reaction.message, ui = main.interfaces[reaction.message.id];
  //Pagination
  if (!user.bot && ui != undefined) if (user.id == ui.user_id) {
    if (reaction.emoji.name == "➡️" && ui.page < ui.embeds.length-1) ui.page++;
    if (reaction.emoji.name == "⬅️" && ui.page > 0) ui.page--;
    reaction.users.remove(user.id);
    //Update page and arrows
    m.edit({ embeds: [ui.embeds[ui.page]] });
    m.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
    if (ui.embeds.length > 1)
      (ui.page == 0) ? m.react("➡️") : await m.react("⬅️");
      if (ui.page != 0 && ui.page != ui.embeds.length-1) await m.react("➡️");
  }
  if (reaction.emoji.name == "🔖") addBookmark(m.id, [m.channelId, m.guildId, m.id], m);
});

client.on("messageCreate", (message) => {
  //Argument processing
  var arg = message.content.replace(/ +(?= )/g, "").split(" ");
  if (arg[0] == "b/help") help(message);
  if (arg[0] == "b/invite") help(message);
  if (arg[0] == "b/list") listBookmarks(message.author.id, arg, message);
  if (arg[0] == "b/status") status(message);
  if (message.type == "REPLY" && arg[0] == "b/add") addBookmark(message.author.id, [message.reference.channelId, message.reference.guildId, message.reference.messageId], message);
  if (message.type == "REPLY" && arg[0] == "b/remove") removeBookmark(message.author.id, message.reference.messageId, message);
});
