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
import Conversations from './Conversations';

const { Content } = Layout;

type UserBioMap = Record<string, string>;

interface ChatData {
  friends: Record<string, string>;
  groups: Record<string, string>;
  you: string;
}

function convertToChatData(jsonData: string): ChatData {
  const parsedData = JSON.parse(jsonData) as {
    friends: Record<string, string>;
    groups: Record<string, string>;
  };

  const chatData: ChatData = {
    friends: {},
    groups: {},
    you: '',
  };

  Object.entries(parsedData.friends).forEach(([chatId, username]) => {
    chatData.friends[chatId] = username;
  });

  Object.entries(parsedData.groups).forEach(([chatId, chatName]) => {
    chatData.groups[chatId] = chatName;
  });

  return chatData;
}

// Define the UserBioMap type
export default function Dashboard() {
  const [users, setUsers] = useState({ name: 'username' });
  const [user, setUser] = useState<AmplifyUser | null>(null);
  const [bio, setBio] = useState<string>('N/A');
  const [conversations, setConversations] = useState<ChatData>({
    friends: {},
    groups: {},
  });

  function listUsers() {
    return window.electron.ipcRenderer
      .invoke('listUsers', [{}])
      .then((data) => {
        const users = JSON.parse(JSON.stringify(data));
        setUsers(users);
        return users;
      });
  }

  function setUserBio(bio: string) {
    setBio(bio);
  }

  function getConversations() {
    return window.electron.ipcRenderer
      .invoke('listChats', [{}])
      .then((data) => {
        let chat = convertToChatData(JSON.stringify(data));
        setConversations(chat);
        console.log(conversations);
      });
  }

  useEffect(() => {
    Auth.currentUserInfo().then((userdata) => {
      window.electron.ipcRenderer
        .invoke('configureBackend', [userdata?.username])
        .then(() => {
          return listUsers();
        })
        .then((users) => {
          console.log(users);
          console.log(userdata);
          console.log(users[userdata?.username]);
          setBio(users[userdata?.username]);
          setUser(userdata);
        })
        .then(() => {
          getConversations();
        });
    });
  }, []);

  return (
    <Layout className="body_dashboard">
      <Sidebar />
      <Content>
        <div className="body_page">
          <Routes>
            <Route
              path="/"
              element={<Conversations chatData={conversations} />}
            />
            <Route
              path="/conversations"
              element={<Conversations chatData={conversations} />}
            />
            <Route
              path="/my_profile"
              element={
                <ProfileSettings
                  username={user?.username}
                  bio={bio}
                  setUserBio={setUserBio}
                />
              }
            />
            <Route
              path="/find_friends"
              element={<FindFriends users={users} />}
            />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}
