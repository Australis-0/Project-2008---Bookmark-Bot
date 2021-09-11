global.initUser = function (arg0_user) {
  if (!main.users[arg0_user]) main.users[arg0_user] = { bookmarks: {} };
  return main.users[arg0_user];
};

//Database
setTimeout(function(){
  global.main = (fs.readFileSync("user_data.json").toString().includes("{")) ? JSON.parse(fs.readFileSync("user_data.json")) : global.main;
  global.main.interfaces = {};
}, 0);
setInterval(function(){
  fs.writeFile("user_data.json", JSON.stringify(main), function (err, data) { if (err) { return console.log(err); }});
}, 30000);
