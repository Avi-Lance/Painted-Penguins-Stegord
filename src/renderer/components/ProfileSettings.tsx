import { useState } from 'react';
import { Avatar, Typography, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AmplifyUser } from '@aws-amplify/ui';


const { Title, Text } = Typography;
const UserOutlinedIcon = UserOutlined as React.ComponentType<any>;

const { TextArea } = Input;

interface ProfileSettingsProps {
  username: string | undefined;
  bio: string
}

function submitBio(bio: string) {
  window.electron.ipcRenderer.invoke('setBio', bio);
}

export default function ProfileSettings(props: ProfileSettingsProps) {

  const changeBio = (event) => {
    setUserBio(event.target.value);
    submitBio(event.target.value);
  };

  return (
    <div>
      <Avatar size={128} icon={<UserOutlinedIcon />} />
      <Title level={2}> {props.username}</Title>
      <Title level={5}>Bio</Title>
      <Form>
        <Form.Item>
          <TextArea rows={4} onChange={changeBio} defaultValue={props.bio} />
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
