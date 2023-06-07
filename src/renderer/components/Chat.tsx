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
  const name = searchParams.get('name');
  const chatId = searchParams.get('chatId');
  const [messages, setMessages] = useState<ChatData>({});

  useEffect(() => {
    window.electron.ipcRenderer.invoke('joinChat', chatId).then(() => {
      window.electron.ipcRenderer.invoke('getMessages', null).then((data) => {
        console.log(data);
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
        <Message
          author="Alice"
          timestamp="9:00 AM"
          message="Hey, how are you?"
        />
        <Message
          author="you"
          timestamp="9:05 AM"
          message="Hi Alice! I'm doing great. How about you?"
        />
        <Message
          author="Alice"
          timestamp="9:07 AM"
          message="I'm good too, thanks for asking. Did you finish that project?"
        />
        <Message
          author="you"
          timestamp="9:10 AM"
          message="Yes, I completed it yesterday. It was quite challenging, but I'm happy with the outcome."
        />
        <Message
          author="Alice"
          timestamp="9:12 AM"
          message="That's awesome! I knew you could do it. We should celebrate sometime."
        />
        <Message
          author="you"
          timestamp="9:15 AM"
          message="Absolutely! Let's plan for dinner this weekend. I'll check my schedule and let you know."
        />
        <Message
          author="Alice"
          timestamp="9:18 AM"
          message="Sounds like a plan. Looking forward to it!"
        />
        <Message
          author="you"
          timestamp="9:20 AM"
          message="Me too. Have a great day, Alice!"
        />
        <Message
          author="Alice"
          timestamp="9:22 AM"
          message="You too! Take care and see you soon."
        />
        <Message
          author="you"
          timestamp="9:25 AM"
          message="Bye Alice! Have a great day ahead!"
        />
        <Message
          author="Alice"
          timestamp="9:28 AM"
          message="Goodbye! Take care and talk to you soon!"
        />
        <Message
          author="Alice"
          timestamp="9:28 AM"
          message="Goodbye! Take care and talk to you soon!"
        />
        <Message
          author="Alice"
          timestamp="9:28 AM"
          message="Goodbye! Take care and talk to you soon!"
        />
        <Message
          author="you"
          timestamp="9:20 AM"
          message="Me too. Have a great day, Alice!"
        />
        <Message
          author="you"
          timestamp="9:20 AM"
          message="Me too. Have a great day, Alice!"
        />
        <Message
          author="you"
          timestamp="9:20 AM"
          message="Me too. Have a great day, Alice!"
        />
        <Message
          author="you"
          timestamp="9:20 AM"
          message="Me too. Have a great day, Alice!"
        />
        <Message
          author="you"
          timestamp="9:20 AM"
          message="Me too. Have a great day, Alice!"
        />
        <Message
          author="you"
          timestamp="9:20 AM"
          message="Me too. Have a great day, Alice!"
        />
      </div>
      <div className="message_create">
        <Input placeholder="Type a message" />
        <Button type="primary">Send</Button>
      </div>
    </>
  );
}
