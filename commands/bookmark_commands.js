global.addBookmark = async function (arg0_user, arg1_bookmark, arg2_message) {
  //Convert from parameters
  var user_id = arg0_user, usr = initUser(arg0_user), bookmark = arg1_bookmark, msg = arg2_message, m = await client.channels.cache.get(msg.channelId).messages.fetch(bookmark[2]);;

  //Add bookmark to DB
  msg.channel.send((!usr.bookmarks[bookmark[2]]) ? ":bookmark: **You have added this message to your collection of bookmarks.**\n\nView them by typing `b/list`." : "You have already added that message as a bookmark!\n\nReply to it with `b/remove` to remove it from your collection.");
  usr.bookmarks[bookmark[2]] = {
    channel: bookmark[0],
    guild: bookmark[1],
    message: bookmark[2],
    og_avatar: m.author.avatarURL(),
    og_user_id: m.author.id,
    og_chnl_id: m.channel.id,
    og_srvr_id: m.guild.id,
    og_content: m.content,
    og_username: m.author.username
  };
};
global.removeBookmark = function (arg0_user, arg1_bookmark_id, arg2_message) {
  //Convert from parameters
  var user_id = arg0_user, usr = initUser(arg0_user), bookmark_id = arg1_bookmark_id, msg = arg2_message;

  //Return result, then remove bookmark from DB
  msg.channel.send((usr.bookmarks[bookmark_id]) ? ":wastebasket: **You have removed this message from your collection of bookmarks.**" : "You didn't have that saved as a bookmark!\n\nType `b/list` for a more updated list of your bookmarks.");
  delete usr.bookmarks[bookmark_id];
};

global.help = function (msg) {
  msg.channel.send({ embeds: [{ color: 0x6699f, description: "A list of all top-level cmds! They do what they sound like.", fields: [{ name: "Commands", value: "`add`, `help`, `invite`, `list`, `remove`, `status`" }]}]})
}
global.invite = function (msg) {
  msg.channel.send({ embeds: [{ color: 0x6699f, author: { name: "Invite" }, title: "Click here!", url: "https://discord.com/api/oauth2/authorize?client_id=885910286664613968&permissions=2405&scope=bot"}]});
};
global.listBookmarks = function (arg0_user, arg1_filters, arg2_message) {
  //Convert from parameters, declare local variables/functions
  var user_id = arg0_user, usr = initUser(arg0_user), filters = parseFilters(arg1_filters), msg = arg2_message;
  filters.user = (filters.user == "this") ? user_id : filters.user, filters.channel = (filters.channel == "this") ? msg.channel.id : filters.channel, filters.guild = (filters.guild == "this") ? msg.guild.id : filters.guild; //'this' argument handler, filter bookmarks below
  var bookmark_embeds = [], bookmarks_list = [], bookmarks_obj = JSON.parse(JSON.stringify(usr.bookmarks)), is_compact = (filters.compact), local_bookmarks_list = [], page = (isNaN(parseInt(filters.page))) ? 0 : parseInt(filters.page)-1,
    bookmarks_obj = (filters.user) ? Object.filter(bookmarks_obj, bookmark => bookmark.og_user_id == filters.user) : bookmarks_obj,
    bookmarks_obj = (filters.channel) ? Object.filter(bookmarks_obj, bookmark => bookmark.og_chnl_id == filters.channel) : bookmarks_obj,
    bookmarks_obj = (filters.guild) ? Object.filter(bookmarks_obj, bookmark => bookmark.og_srvr_id == filters.guild) : bookmarks_obj, bookmark_keys = Object.keys(bookmarks_obj);

  //Generate compact formatting
  if (bookmark_keys.length > 0) for (var i = 0; i < bookmark_keys.length; i++) {
    var b = usr.bookmarks[bookmark_keys[i]];
    (!is_compact) ? bookmark_embeds.push({
      color: 0x6699f,
      title: `Go to ${client.guilds.cache.get(b.guild).name}`,
      url: `https://discord.com/channels/${b.guild}/${b.channel}/${b.message}`,
      author: { name: b.og_username, icon_url: `${b.og_avatar}`},
      footer: { text: (b.og_content.substring(0, 50)) + ((b.og_content >= 50) ? "..." : "")}
    }) : bookmarks_list.push(`${i+1}) ${b.og_username} - [${b.og_content.substring(0, 50) + ((b.og_content >= 50) ? "..." : "")}](https://discord.com/channels/${b.guild}/${b.channel}/${b.message})`);
  }
  if (bookmark_keys.length == 0) bookmarks_list.push("No bookmarks found!");

  //Generate embeds if bookmark_embeds is still empty
  if (bookmark_embeds.length == 0) for (var i = 0; i < bookmarks_list.length; i++) {
    local_bookmarks_list.push(bookmarks_list[i]);
    if (i != 0 || bookmarks_list.length == 1) if (i % 20 == 0 || i == bookmarks_list.length-1) {
      bookmark_embeds.push({
        color: 0x6699f,
        title: `**Bookmark List (Page ${Math.ceil(i/20)} of ${Math.ceil(bookmarks_list.length/20)}):**`,
        description: local_bookmarks_list.join("\n")
      });
      local_bookmarks_list = [];
    }
  }

  scrollMessage(msg, bookmark_embeds, page, user_id);
};
global.parseFilters = function (arg0_original_args) {
  //Convert from parameters, declare local instance variables
  var args = arg0_original_args, processed_obj = {};

  //Process arguments, return object
  for (var i = 0; i < args.length; i++) if (args[i].includes(":")) f = /.*?(?=:):/gm, processed_obj[args[i].match(f)[0].replace(":", "")] = args[i].replace(args[i].match(f)[0], "");
  processed_obj.user = (processed_obj.user) ? processed_obj.user.replace(/[<!@>]/gm, "") : undefined, processed_obj.channel = (processed_obj.channel) ? processed_obj.channel.replace(/[<#>]/gm, "") : undefined;
  return processed_obj;
};
global.scrollMessage = async function (arg0_message, arg1_embeds, arg2_starting_page, arg3_user_id) {
  //Convert from parameters, declare local instance variables
  var msg = arg0_message, embeds = arg1_embeds, starting_page = (arg2_starting_page) ? arg2_starting_page : 0, user_id = arg3_user_id;

  //Send first page as embed, add interface object to message
  msg.channel.send({ embeds: [embeds[starting_page]] }).then((msg) => {
    main.interfaces[msg.id] = { embeds: embeds, page: starting_page, starting_page: starting_page, user_id: user_id };

    if (embeds.length > 1)
      (starting_page == 0) ? msg.react("➡️") : msg.react("⬅️");
      if (starting_page != 0 && starting_page != embeds.length-1) msg.react("➡️");
  });
};
global.status = function (msg) {
  msg.channel.send({ embeds: [{
    color: 0x6699f, title: "Status", fields: [{ name: "Guilds", value: `in ${client.guilds.cache.length} of them`}, { name: "Commands", value: global.commands }, { name: "Version", value: process.version }, { name: "Ping", value: `${Date.now() - msg.createdTimestamp}ms` }]
  }]});
};
