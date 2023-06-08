import User from './User';

// Define the UserBioMap type
type UserBioMap = Record<string, string>;

interface FriendsProps {
  users: UserBioMap;
}

export default function FindFriends(props: FriendsProps) {
  const userEntries = Object.entries(props.users);

  return (
    <div className="friend_list">
      {userEntries.map(([user, bio]) => (
        <User key={user} name={user} bio={bio} />
      ))}
    </div>
  );
}
