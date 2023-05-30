import { Input } from 'antd';
import User from './User'

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

export default function FindFriends() {
  return (
    <>
      <Search placeholder="Search for Friends" onSearch={onSearch} enterButton />
      <div className="friend_list">
        <User name="John Doe" />
        <User name="John Doe" />
        <User name="John Doe" />
        <User name="John Doe" />
        <User name="John Doe" />
        <User name="John Doe" />
        <User name="John Doe" />
      </div>
    </>
  );
}
