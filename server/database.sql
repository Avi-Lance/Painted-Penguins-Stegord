CREATE TABLE account (
    id TEXT PRIMARY KEY,
    last_read_message_id INTEGER,
    bio TEXT
);

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    chat_name TEXT NOT NULL
);

CREATE TABLE chat_participants (
    account_id TEXT REFERENCES account(id) NOT NULL,
    chat_id INTEGER REFERENCES chat(id) NOT NULL,
    PRIMARY KEY(account_id, chat_id)
);

CREATE TABLE messages (
    account_id TEXT REFERENCES account(id) NOT NULL,
    chat_id INTEGER REFERENCES chat(id) NOT NULL,
    intake_order SERIAL,
    content TEXT NOT NULL,
    PRIMARY KEY(account_id, chat_id, intake_order)
);

CREATE TABLE friends (
    account_one TEXT REFERENCES account(id) NOT NULL,
    account_two TEXT REFERENCES account(id) NOT NULL,
    chat_id INTEGER REFERENCES chat(id) NOT NULL,
    PRIMARY KEY(account_one, account_two)
);
