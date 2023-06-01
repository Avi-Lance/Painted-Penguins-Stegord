const { spawn } = require('child_process');

module.exports = class BackendManager {
  constructor(cognitoToken, mediumImage, exe_dir) {
    this.token = cognitoToken;
    this.image = mediumImage;
    this.dir = exe_dir;
  }

  setToken(cognitoToken) {
    this.token = cognitoToken;
  }

  getMessages(justNew) {
    // Decide message breadth parameter
    var breadth = 'all';
    if (justNew === true) {
      breadth = 'new';
    }

    // Spawn child process
    var command = spawn(this.dir + 'get_messages', [
      this.image,
      breadth,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  sendMessage(chatId, message) {
    var command = spawn(this.dir + 'send_message', [
      this.image,
      chatId,
      message,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  setBio(bio) {
    var command = spawn(this.dir + 'set_bio', [this.image, bio, this.token]);
    return this.createCommandPromise(command);
  }

  listUsers() {
    var command = spawn(this.dir + 'list_users', [this.token]);
    return this.createCommandPromise(command);
  }

  listChats() {
    var command = spawn(this.dir + 'list_chats', [this.token]);
    return this.createCommandPromise(command);
  }

  leaveChat(chatId) {
    var command = spawn(this.dir + 'leave_chat', [
      this.image,
      chatId,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  joinChat(chatId) {
    var command = spawn(this.dir + 'join_chat', [
      this.image,
      chatId,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  createChat(chatName) {
    var command = spawn(this.dir + 'create_chat', [
      this.image,
      chatName,
      this.token,
    ]);
    return this.createCommandPromise(command);
  }

  addFriend(friendName) {
    var command = spawn(this.dir + 'add_friend', [
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
          resolve(JSON.parse(data.toString()));
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
