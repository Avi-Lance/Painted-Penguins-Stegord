import './components.css';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileSettings from './ProfileSettings';
import Chat from './Chat';

const { Content } = Layout;

export default function Dashboard() {
  return (
    <Layout className="body_dashboard">
      <Sidebar />
      <Content>
        <div className="body_page">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route
              path="/my_profile"
              element={<ProfileSettings username="Username" bio="Sample bio" />}
            />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}
