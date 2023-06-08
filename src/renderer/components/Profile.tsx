/*
Skeleton for Profile Settings component
Will want to add functionality for backend mainly for editing and displaying bio
Drafted by Jaxon Simmons May 28
*/

import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;
const UserOutlinedIcon = UserOutlined as React.ComponentType<any>;

export default function Profile() {
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('username');
  const bio = searchParams.get('bio');

  return (
    <div>
      <Avatar size={128} icon={<UserOutlinedIcon />} />
      <Title level={2}>{username}</Title>
      <Title level={5}>Bio</Title>
      <div className="bio_container">
        <div className="bio_body">
          <p>{bio}</p>
        </div>
      </div>
    </div>
  );
}
