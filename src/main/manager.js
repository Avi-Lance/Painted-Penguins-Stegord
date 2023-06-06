const { spawn } = require('child_process');
const { promises } = require('dns');

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
    return new Promise((resolve, reject) => {
      resolve(true);
    });
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
    let breadth = 'all';
    if (justNew === true) {
      breadth = 'new';
    }

    // Spawn child process
    const command = spawn('python3', [
      `${this.dir}get_messages.py`,
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
    const command = spawn('python3', [
      `${this.dir}send_message.py`,
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
    const command = spawn('python3', [
      `${this.dir}set_bio.py`,
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
    console.log('I am activating the list users command!');
    const command = spawn('python3', [`${this.dir}list_users.py`, this.token]);
    return this.createCommandPromise(command);
  }

  getUserBio(username) {
    return this.listUsers().then((data) => {
      if (data.hasOwnProperty(username)) {
        console.log(username);
        console.log(data);
        return data[username];
      }
      return null;
    });
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
    const command = spawn('python3', [`${this.dir}list_chats.py`, this.token]);
    return this.createCommandPromise(command);
  }

  /*
  returns:
    {"success": true}
  else:
    {"error": message}
  */
  leaveChat(chatId) {
    const command = spawn('python3', [
      `${this.dir}leave_chat.py`,
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
    const command = spawn('python3', [
      `${this.dir}join_chat.py`,
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
    const command = spawn('python3', [
      `${this.dir}create_chat.py`,
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
    const command = spawn('python3', [
      `${this.dir}add_friend.py`,
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
