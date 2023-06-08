import { Button } from 'antd';

function addFriend(name) {
  window.electron.ipcRenderer.invoke('addFriend', name).then(() => {
    alert(`You added ${name}`);
  });
}

export default function User({ name }) {
  return (
    <div className="user_list_item">
      <p>{name}</p>
      <Button type="primary" onClick={() => addFriend(name)}>Add as Friend</Button>
    </div>
  );
}
