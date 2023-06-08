import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

function addFriend(name) {
  window.electron.ipcRenderer.invoke('addFriend', name).then(() => {
    alert(`You added ${name}`);
  });
}

export default function User({ name, bio }) {
  const navigate = useNavigate();

  return (
    <div className="user_list_item">
      <p>{name}</p>
      <div>
        <Button
          type="primary"
          onClick={() => navigate(`/profile?&username=${name}&bio=${bio}`)}
        >
          View Profile
        </Button>
        <Button type="primary" onClick={() => addFriend(name)}>
          Add as Friend
        </Button>
      </div>
    </div>
  );
}
