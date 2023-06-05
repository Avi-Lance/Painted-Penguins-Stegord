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
import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from '../../redux/usersSlice';

const { Content } = Layout;

type UserBioMap = Record<string, string>;

// Define the UserBioMap type
export default function Dashboard() {
  const userState = useSelector((state: { users: UserBioMap }) => state.users);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AmplifyUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userdata = await Auth.currentUserInfo();
        setUser(userdata);

        await window.electron.ipcRenderer.invoke(
          'configureBackend',
          userdata.username
        );

        const receivedUsers: UserBioMap =
          await window.electron.ipcRenderer.invoke('listUsers', [{}]);

        dispatch(setUsers(receivedUsers));
      } catch (error) {
        // Handle error
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div>
        Fetching Stegographied Data. This may take a while, but will speed up
        use.
      </div>
    );
  }

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
                <ProfileSettings username={user?.username} bio="Sample bio" />
              }
            />
            <Route path="/find_friends" element={<FindFriends />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}
