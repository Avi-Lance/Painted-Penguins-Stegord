import './components.css';
import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { AmplifyUser } from '@aws-amplify/ui';
import Sidebar from './Sidebar';
import ProfileSettings from './ProfileSettings';
import Chat from './Chat';
import FindFriends from './FindFriends';

const { Content } = Layout;

type UserBioMap = Record<string, string>;



// Define the UserBioMap type
export default function Dashboard() {
  const [users, setUsers] = useState({'name' : 'username'});
  const [user, setUser] = useState<AmplifyUser | null>(null);
  const [bio, setBio] = useState<string>("N/A");


  function listUsers(){
    return window.electron.ipcRenderer.invoke('listUsers', [{}]).then(data => {
      let users = JSON.parse(JSON.stringify(data))
      setUsers(users)
      return users
    });
  }

  
  function getUserBio(){
    return window.electron.ipcRenderer.invoke('getUserBio', user?.username).then(data => {
      setBio(data)
      console.log(data)
  });
  }


  useEffect(() => {
      Auth.currentUserInfo().then((userdata)=>{
          window.electron.ipcRenderer.invoke(
            'configureBackend',
            [user?.username]
          ).then(()=> {
            return listUsers();
          }).then((users)=> {
            console.log(users)
            console.log(userdata)
            console.log(users[userdata?.username])
            setBio(users[userdata?.username]);
            setUser(JSON.parse(JSON.stringify(userdata)))
          });
  })}, []);

  
    

  return (
    <Layout className="body_dashboard">
      <Sidebar />
      <Content>
        <div className="body_page">
          <Routes>
            <Route path="/chat" element={<Chat />} />
            <Route
              path="/my_profile"
              element={
                <ProfileSettings username={user?.username} bio={bio} />
              }
            />
            <Route path="/find_friends" element={<FindFriends users={users}/>} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}
