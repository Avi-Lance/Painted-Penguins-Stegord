const {spawn} = require('child_process');

module.exports = class BackendManager {
    constructor(cognitoToken, mediumImage) {
        this.token = cognitoToken;
        this.image = mediumImage;
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
        var command = spawn('python3', ['get_messages.py', this.image, breadth, this.token]);
        return this.createCommandPromise(command);
    }

    sendMessage(chatId, message) {
        var command = spawn('python3', ['send_message.py', this.image, chatId, message, this.token]);
        return this.createCommandPromise(command);
    }

    setBio(bio) {
        var command = spawn('python3', ['set_bio.py', this.image, bio, this.token]);
        return this.createCommandPromise(command);
    }

    listUsers() {
        var command = spawn('python3', ['list_users.py', this.token]);
        return this.createCommandPromise(command);
    }

    listChats() {
        var command = spawn('python3', ['list_chats.py', this.token]);
        return this.createCommandPromise(command);
    }

    leaveChat(chatId) {
        var command = spawn('python3', ['leave_chat.py', this.image, chatId, this.token]);
        return this.createCommandPromise(command);
    }

    joinChat(chatId) {
        var command = spawn('python3', ['join_chat.py', this.image, chatId, this.token]);
        return this.createCommandPromise(command);
    }

    createChat(chatName) {
        var command = spawn('python3', ['create_chat.py', this.image, chatName, this.token]);
        return this.createCommandPromise(command);
    }

    addFriend(friendName) {
        var command = spawn('python3', ['add_friend.py', this.image, friendName, this.token]);
        return this.createCommandPromise(command);
    }

    createCommandPromise(command) {
        return new Promise((resolve, reject) => {
            try {
                command.stdout.on('data', (data) => {
                    resolve(JSON.parse(data.toString()));
                });
                command.on('error', err => {
                    throw new Error(err.message);;
                });
            } catch(e) {
                reject(e);
            }
        });
    }
}