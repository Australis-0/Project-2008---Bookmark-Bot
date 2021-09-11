global.addBookmark = async function (arg0_user, arg1_bookmark, arg2_message) {
  //Convert from parameters
  var user_id = arg0_user, usr = initUser(arg0_user), bookmark = arg1_bookmark, msg = arg2_message;

  //Add bookmark to DB
  usr.bookmarks[bookmark[2]] = { channel: bookmark[0], guild: bookmark[1], message: bookmark[2], original_message: await client.channels.cache.get(msg.channelId).messages.fetch(bookmark[2]) };
  msg.channel.send((!usr.bookmarks[bookmark_id]) ? ":bookmark: **You have added this message to your collection of bookmarks.**\n\nView them by typing `b/list`." : "You have already added that message as a bookmark!\n\nReply to it with `b/remove` to remove it from your collection.");
};
global.removeBookmark = function (arg0_user, arg1_bookmark_id, arg2_message) {
  //Convert from parameters
  var user_id = arg0_user, usr = initUser(arg0_user), bookmark_id = arg1_bookmark_id, msg = arg2_message;

  //Return result, then remove bookmark from DB
  msg.channel.send((usr.bookmarks[bookmark_id]) ? ":wastebasket: **You have removed this message from your collection of bookmarks.**" : "You didn't have that saved as a bookmark!\n\nType `b/list` for a more updated list of your bookmarks.");
  delete usr.bookmarks[bookmark_id];
};

global.listBookmarks = function (arg0_user, arg1_filters, arg2_message) {
  //Convert from parameters, declare local variables/functions
  var user_id = arg0_user, usr = initUser(arg0_user), filters = parseFilters(arg1_filters), msg = arg2_message;
  filters.user = (filters.user == "this") ? user_id : filters.user, filters.channel = (filters.channel == "this") ? msg.channel.id : filters.channel, filters.guild = (filters.guild == "this") ? msg.guild.id : filters.guild; //'this' argument handler, filter bookmarks below
  var bookmark_embeds = [], bookmarks_list = [], bookmarks_obj = JSON.parse(JSON.stringify(usr.bookmarks)), is_compact = (filters.compact), local_bookmarks_list = [], page = (isNaN(parseInt(filters.page))) ? 0 : parseInt(filters.page)-1,
    bookmarks_obj = (filters.user) ? Object.filter(bookmarks_obj, bookmark => bookmark.original_message.author.id == filters.user) : bookmarks_obj,
    bookmarks_obj = (filters.channel) ? Object.filter(bookmarks_obj, bookmark => bookmark.original_message.channel.id == filters.channel) : bookmarks_obj,
    bookmarks_obj = (filters.guild) ? Object.filter(bookmarks_obj, bookmark => bookmark.original_message.guild.id == filters.guild) : bookmarks_obj, bookmark_keys = Object.keys(bookmarks_obj);

  //Generate compact formatting
  if (is_compact) for (var i = 0; i < bookmark_keys.length; i++) bookmarks_list.push(`${i+1}) ${b.original_message.author.username} - ${b.original_message.content.substring(0, 50) + (bookmark.original_message.length >= 50) ? "..." : ""}`);
  if (bookmark_keys.length > 0 && !is_compact) for (var i = 0; i < bookmark_keys.length; i++) {
    var b = usr.bookmarks[bookmark_keys[i]];
    bookmark_embeds.push({
      color: 0x6699f,
      title: `Go to ${client.guilds.cache.get(b.guild).name}`,
      url: `https://discord.com/channels/${b.guild}/${b.channel}/${b.message}`,
      author: { name: b.original_message.author.username, icon_url: `https://discord.com/users/${b.original_message.author.avatarURL()}`},
      footer: { text: (b.original_message.content.substring(0, 50)) + (bookmark.original_message.length >= 50) ? "..." : ""}
    });
  }
  if (bookmark_keys.length == 0) bookmarks_list.push("No bookmarks found!");

  //Generate embeds if bookmark_embeds is still empty
  if (bookmark_embeds.length == 0) for (var i = 0; i < bookmarks_list.length; i++) {
    local_bookmarks_list.push(bookmarks_list[i]);
    if (i != 0 || local_bookmarks_list.length == 1) if (i % 20 == 0 || i == local_bookmarks_list.length-1) bookmark_embeds.push({
      color: 0x6699f,
      title: `**Bookmark List (Page ${Math.ceil(i/20)} of ${Math.ceil(bookmarks_list.length/20)}):`,
      description: local_bookmarks_list.join("\n")
    });
  }

  scrollMessage(msg, bookmark_embeds, page);

  /*
    Filters:
      {
        channel: channel_id,
        guild: guild_id,
        user: user_id,
        is_compact: true/false,
        page: #
      }
  */
};
global.parseFilters = function (arg0_original_args) {
  //Convert from parameters, declare local instance variables
  var args = arg0_original_args, processed_obj = {};

  //Process arguments, return object
  for (var i = 0; i < args.length; i++) if (args[i].includes(":")) f = /.*?(?=:):/gm, processed_obj[args[i].match(f)[0].replace(":", "")] = args[i].replace(args[i].match(f)[0], "");
  processed_obj.user = (processed_obj.user) ? processed_obj.user.replace(/[<!@>]/gm, "") : undefined, processed_obj.channel = (processed_obj.channel) ? processed_obj.channel.replace(/[<#>]/gm, "") : undefined;
  return processed_obj;
};
global.scrollMessage = async function (arg0_message, arg1_embeds, arg2_starting_page) {
  //Convert from parameters, declare local instance variables
  var msg = arg0_message, embeds = arg1_embeds, starting_page = (arg2_starting_page) ? arg2_starting_page : 0;

  //Send first page as embed, add interface object to message
  msg.channel.send(embeds[starting_page]).then((msg) => {
    (starting_page == 0) ? msg.react("➡️") : msg.react("⬅️");
    if (starting_page != 0 && starting_page != embeds.length-1) msg.react("➡️");

    main.interfaces[msg.id] = { page: starting_page };
  });
}
