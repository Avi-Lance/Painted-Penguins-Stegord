import Message from './Message';
import { Button, Input, Select, Space } from 'antd';

export default function Chat() {
  return (
    <>
      <h1>You are chatting with Alice</h1>
      <div className="chat_body">
        <Message author="Alice" timestamp="9:00 AM" message="Hey, how are you?"/>
        <Message author="you" timestamp="9:05 AM" message="Hi Alice! I'm doing great. How about you?"/>
        <Message author="Alice" timestamp="9:07 AM" message="I'm good too, thanks for asking. Did you finish that project?"/>
        <Message author="you" timestamp="9:10 AM" message="Yes, I completed it yesterday. It was quite challenging, but I'm happy with the outcome."/>
        <Message author="Alice" timestamp="9:12 AM" message="That's awesome! I knew you could do it. We should celebrate sometime."/>
        <Message author="you" timestamp="9:15 AM" message="Absolutely! Let's plan for dinner this weekend. I'll check my schedule and let you know."/>
        <Message author="Alice" timestamp="9:18 AM" message="Sounds like a plan. Looking forward to it!"/>
        <Message author="you" timestamp="9:20 AM" message="Me too. Have a great day, Alice!"/>
        <Message author="Alice" timestamp="9:22 AM" message="You too! Take care and see you soon."/>
        <Message author="you" timestamp="9:25 AM" message="Bye Alice! Have a great day ahead!"/>
        <Message author="Alice" timestamp="9:28 AM" message="Goodbye! Take care and talk to you soon!"/>
        <Message author="Alice" timestamp="9:28 AM" message="Goodbye! Take care and talk to you soon!"/>
        <Message author="Alice" timestamp="9:28 AM" message="Goodbye! Take care and talk to you soon!"/>
        <Message author="you" timestamp="9:20 AM" message="Me too. Have a great day, Alice!"/>
        <Message author="you" timestamp="9:20 AM" message="Me too. Have a great day, Alice!"/>
        <Message author="you" timestamp="9:20 AM" message="Me too. Have a great day, Alice!"/>
        <Message author="you" timestamp="9:20 AM" message="Me too. Have a great day, Alice!"/>
        <Message author="you" timestamp="9:20 AM" message="Me too. Have a great day, Alice!"/>
        <Message author="you" timestamp="9:20 AM" message="Me too. Have a great day, Alice!"/>
      </div>
      <div className="message_create">
        <Input placeholder="Type a message" />
        <Button type="primary">Send</Button>
      </div>
    </>
  );
}
