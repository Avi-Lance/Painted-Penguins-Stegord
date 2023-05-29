/*
Skeleton for Profile Settings component
Will want to add functionality for backend mainly for editing and displaying bio
Drafted by Jaxon Simmons May 28
*/
import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const UserOutlinedIcon = UserOutlined as React.ComponentType<any>;

interface ProfileSettingsProps {
  username: string;
  bio: string;
}

export default function ProfileSettings({
  username,
  bio,
}: ProfileSettingsProps) {
  return (
    <div>
      <Avatar size={128} icon={<UserOutlinedIcon />} />
      <Title level={2}>{username}</Title>
      <Title level={5}>Bio</Title>
      <Text>{bio}</Text>
    </div>
  );
}
