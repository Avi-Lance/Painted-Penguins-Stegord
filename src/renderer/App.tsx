import { Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

export default function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo-vertical">
          <Menu theme="dark" mode="inline" />
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}/>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer}}>content</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Stegord ©2023</Footer>
      </Layout>
    </Layout>
  );
}
