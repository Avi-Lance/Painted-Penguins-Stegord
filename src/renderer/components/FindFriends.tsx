import { useState } from 'react';
import User from './User';

export default function FindFriends() {
  const [users, setUsers] = useState({'Loading Users...' : 'temporary'});

  window.electron.ipcRenderer.sendMessage('listUsers', [null]);

  window.electron.ipcRenderer.on('listUsers', async (event, arg) => {
    setUsers(event);
  });

  return (
    <div className="friend_list">
      {Object.keys(users).map((user) => {
        return <User name={user} />;
      })}
    </div>
  );
}
