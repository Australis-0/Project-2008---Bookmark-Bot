global.initUser = function (arg0_user) {
  if (!main.users[arg0_user]) main.users[arg0_user] = { bookmarks: {} };
};
