import { useState } from 'react';
import { Avatar, Typography, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const UserOutlinedIcon = UserOutlined as React.ComponentType<any>;

const { TextArea } = Input;

interface ProfileSettingsProps {
  username: string;
  bio: string;
}

function submitBio(bio) {
  window.electron.ipcRenderer.sendMessage('setBio', bio);
}

export default function ProfileSettings({
  username,
  bio,
}: ProfileSettingsProps) {
  const [userBio, setUserBio] = useState(bio);

  const changeBio = (event) => {
    setUserBio(event.target.value);
  };

  return (
    <div>
      <Avatar size={128} icon={<UserOutlinedIcon />} />
      <Title level={2}>{username}</Title>
      <Title level={5}>Bio</Title>
      <Form>
        <Form.Item>
          <TextArea rows={4} onChange={changeBio} defaultValue={userBio} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => setUserBio(userBio)}>
            Submit Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
