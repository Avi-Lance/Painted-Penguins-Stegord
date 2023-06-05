import User from './User';
import { useSelector } from 'react-redux';

// Assuming the user slice state is defined as `UserState`
interface UserState {
  users: UserBioMap;
}

// Define the UserBioMap type
type UserBioMap = Record<string, string>;

export default function FindFriends() {
  const userState = useSelector((state: { users: UserState }) => state.users);
  console.log(userState);
  if (!userState?.users) {
    return <div>Loading...</div>;
  }

  const users = userState?.users;
  console.log(userState);

  return (
    <div className="friend_list">
      {Object.keys(users).map((user) => (
        <User key={user} name={user} />
      ))}
    </div>
  );
}
