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
  filters.user = (filters.user == "this") ? user_id : filters.user, filters.channel = (filters.channel == "this") ? msg.channel.id : filters.channel, filters.guild = (filters.guild == "this") ? msg.guild.id : filters.guild; //'this' argument handler
  var bookmarks_list = [], bookmarks_obj = JSON.parse(JSON.stringify(usr.bookmarks)), is_compact = (filters.compact), page = (isNaN(parseInt(filters.page))) ? 0 : parseInt(filters.page)-1,
    bookmarks_obj = (filters.user) ? Object.filter(bookmarks_obj, bookmark => bookmark.original_message.author.id == filters.user) : bookmarks_obj,
    bookmarks_obj = (filters.channel) ? Object.filter(bookmarks_obj, bookmark => bookmark.original_message.channel.id == filters.channel) : bookmarks_obj,
    bookmarks_obj = (filters.guild) ? Object.filter(bookmarks_obj, bookmark => bookmark.original_message.guild.id == filters.guild) : bookmarks_obj;
  
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
