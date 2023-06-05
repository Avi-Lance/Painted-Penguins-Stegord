const { spawn } = require('child_process');

module.exports = class BackendManager {
  constructor(cognitoToken, mediumImage, currentDir) {
    this.token = cognitoToken;
    this.image = mediumImage;
    this.dir = currentDir;
  }

  /*
  cognitoToken is the account user name for now.
  In the future it will be the extracted cognito user token
  */
  setToken(cognitoToken) {
    this.token = cognitoToken;
  }

  /*
  {
    "<chat id 1>": [
      {"sender": string, "order_num": int, "message": string},
      ...
    ],
    ...
    "<chat id n>": [
      {"sender": string, "order_num": int, "message": string},
      ...
    ]
  }
  */
  getMessages(justNew) {
    // Decide message breadth parameter
    var breadth = 'all';
    if (justNew === true) {
      breadth = 'new';
    }

    // Spawn child process
    var command = spawn('python3', [
      this.dir + 'get_messages.py',
      this.image,
      breadth,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  /*
  returns the same thing as getMessages,
  grabbing all new messages,
  including the one just sent
  */
  sendMessage(chatId, message) {
    var command = spawn('python3', [
      this.dir + 'send_message.py',
      this.image,
      chatId,
      message,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  /*
  returns:
    {"success": true}
  else:
    {"error": message}
  */
  setBio(bio) {
    var command = spawn('python3', [
      this.dir + 'set_bio.py',
      this.image,
      bio,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  /*
  {
    "<username 1>": <bio>,
    ...,
    "<username n>": <bio>
  }
  */
  listUsers() {
    var command = spawn('python3', [this.dir + 'list_users.py', this.token]);
    return this.createCommandPromise(command);
  }

  /*
  {
    "friends": {
      "<chat id>": "<username>"
    },
    "groups": {
      "<chat id>": "<chat name>",
      ...
    }
  }
  */
  listChats() {
    var command = spawn('python3', [this.dir + 'list_chats.py', this.token]);
    return this.createCommandPromise(command);
  }

  /*
  returns:
    {"success": true}
  else:
    {"error": message}
  */
  leaveChat(chatId) {
    var command = spawn('python3', [
      this.dir + 'leave_chat.py',
      this.image,
      chatId,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  /*
  returns:
    {"success": true}
  else:
    {"error": message}
  */
  joinChat(chatId) {
    var command = spawn('python3', [
      this.dir + 'join_chat.py',
      this.image,
      chatId,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  /*
  {"chat_id": int}
  */
  createChat(chatName) {
    var command = spawn('python3', [
      this.dir + 'create_chat.py',
      this.image,
      chatName,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  /*
  {"chat_id": int}
  */
  addFriend(friendName) {
    var command = spawn('python3', [
      this.dir + 'add_friend.py',
      this.image,
      friendName,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  createCommandPromise(command) {
    return new Promise((resolve, reject) => {
      try {
        command.stdout.on('data', (data) => {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (e) {}
        });
        command.on('error', (err) => {
          throw new Error(err.message);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};
