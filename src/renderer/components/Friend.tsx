import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

interface FriendData {
  chatId: string;
  name: string;
}

export default function Friend({ chatId, name }: FriendData) {
  const navigate = useNavigate();

  return (
    <div className="user_list_item">
      <p>{name}</p>
      <div>
        <Button type="primary">View Profile</Button>
        <Button
          type="primary"
          onClick={() => navigate(`/chat?name=${name}&chatId=${chatId}`)}
        >
          Chat
        </Button>
      </div>
    </div>
  );
}
