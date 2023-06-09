import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Input } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import Message from './Message';

interface ChatMessage {
  sender: string;
  order_num: number;
  message: string;
}

interface ChatData {
  [chatId: string]: ChatMessage[];
}

function convertToChatData(json: { [key: string]: any[] }): ChatData {
  const chatData: ChatData = {};

  Object.entries(json).forEach(([chatId, messages]) => {
    const chatMessages: ChatMessage[] = messages.map((message: any) => ({
      sender: message.sender,
      order_num: message.order_num,
      message: message.message,
    }));
    chatData[chatId] = chatMessages;
  });

  return chatData;
}

function appendChatData(targetData: ChatData, newData: ChatData): ChatData {
  const mergedData: ChatData = { ...targetData };

  Object.keys(newData).forEach((chatId) => {
    if (Object.prototype.hasOwnProperty.call(mergedData, chatId)) {
      mergedData[chatId] = [...mergedData[chatId], ...newData[chatId]];
    } else {
      mergedData[chatId] = [...newData[chatId]];
    }
  });

  return mergedData;
}

export default function Chat() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const you = searchParams.get('you');
  const name = searchParams.get('name');
  const chatId = searchParams.get('chatId');
  const [username, setUsername] = useState<string>();
  const [messages, setMessages] = useState<ChatData>({});
  const [message, setMessage] = useState<string>('');

  const sendMessage: void = () => {
    setMessage('');

    window.electron.ipcRenderer
      .invoke('sendMessage', [chatId, message])
      .then((data) => {
        setMessages(appendChatData(messages, convertToChatData(data)));
      });
  };

  const refreshConversation: void = () => {
    window.electron.ipcRenderer.invoke('getMessages', true).then((data) => {
      setMessages(appendChatData(messages, convertToChatData(data)));
      console.log(messages);
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getUsername', [{}]).then((data) => {
      setUsername(data);
    });

    window.electron.ipcRenderer.invoke('joinChat', chatId).then(() => {
      window.electron.ipcRenderer.invoke('getMessages', false).then((data) => {
        setMessages(convertToChatData(data));
        console.log(messages);
      });
    });

    return () => {
      window.electron.ipcRenderer.invoke('leaveChat', chatId).then(() => {
        console.log(`left chat ${chatId}`);
      });
    };
  }, []);

  const sortedMessages = Object.values(messages)
    .flatMap((chatMessages) => chatMessages)
    .sort((a, b) => a.order_num - b.order_num);

  return (
    <>
      <div className="chat_header_container">
        <div className="chat_header">
          <h1>You are chatting with {name}</h1>
          <Button
            type="primary"
            shape="circle"
            icon={<RedoOutlined />}
            onClick={refreshConversation}
          />
        </div>
      </div>
      <div className="chat_body">
        {sortedMessages.map((message) => (
          <Message
            key={message.id}
            you={username}
            author={message.sender}
            message={message.message}
          />
        ))}
      </div>
      <div className="message_create">
        <Input
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <Button type="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </>
  );
}
