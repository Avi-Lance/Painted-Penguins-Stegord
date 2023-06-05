import './components.css';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { AmplifyUser } from '@aws-amplify/ui';
import Sidebar from './Sidebar';
import ProfileSettings from './ProfileSettings';
import Chat from './Chat';
import FindFriends from './FindFriends';

const { Content } = Layout;

const userdata: AmplifyUser = await Auth.currentUserInfo();

export default function Dashboard() {
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
                <ProfileSettings
                  username={userdata?.username}
                  bio="Sample bio"
                />
              }
            />
            <Route path="/find_friends" element={<FindFriends />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}
