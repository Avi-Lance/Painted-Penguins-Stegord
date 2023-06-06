import { Button } from 'antd';

interface FriendData {
  chatId: string;
  name: string;
}

function chatWith(name: string, chatId: string) {
  alert(`You are chatting with ${name} with chat id ${chatId}`);
}

export default function Friend({ chatId, name }: FriendData) {
  return (
    <div className="user_list_item">
      <p>{name}</p>
      <div>
        <Button type="primary">View Profile</Button>
        <Button type="primary" onClick={() => chatWith(name, chatId)}>Chat</Button>
      </div>
    </div>
  );
}
