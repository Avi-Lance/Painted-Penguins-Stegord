import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

const handleSignOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('Error signing out:', error);
  }
};
const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Sider>
      <Menu
        theme="dark"
        mode="inline"
        onClick={({ key }) => {
          if (key === 'signout') {
            handleSignOut();
          } else {
            navigate(key);
          }
        }}
        items={[
          { label: 'Chat', key: '/conversations' },
          { label: 'Find Friends', key: '/find_friends' },
          { label: 'My Profile', key: '/my_profile' },
          { label: 'Sign Out', key: 'signout' },
        ]}
      />
    </Sider>
  );
}
