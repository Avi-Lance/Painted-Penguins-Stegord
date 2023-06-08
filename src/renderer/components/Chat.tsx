import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Input } from 'antd';
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

export default function Chat() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const you = searchParams.get('you');
  const name = searchParams.get('name');
  const chatId = searchParams.get('chatId');
  const [messages, setMessages] = useState<ChatData>({});

  useEffect(() => {
    window.electron.ipcRenderer.invoke('joinChat', chatId).then(() => {
      window.electron.ipcRenderer.invoke('getMessages', null).then((data) => {
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

  return (
    <>
      <h1>You are chatting with {name}</h1>
      <div className="chat_body">
        {Object.values(messages).map((chatMessages) =>
          chatMessages.map((message, index) => (
            <Message
              key={index}
              you={you}
              author={message.sender}
              message={message.message}
            />
          ))
        )}
      </div>
      <div className="message_create">
        <Input placeholder="Type a message" />
        <Button type="primary">Send</Button>
      </div>
    </>
  );
}
