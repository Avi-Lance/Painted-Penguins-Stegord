import './components.css';
import { Layout } from 'antd';
import Sidebar from './Sidebar';

const { Content } = Layout;

export default function Dashboard({ children }) {
  return (
    <Layout className="body_dashboard">
      <Sidebar />
      <Content>
        <div className="body_page">
          { children }
        </div>
      </Content>
    </Layout>
  );
}
