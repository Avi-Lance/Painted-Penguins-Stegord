import User from './User';
import { useState } from 'react';

// Assuming the user slice state is defined as `UserState`
interface UserState {
  users: UserBioMap;
}

// Define the UserBioMap type
type UserBioMap = Record<string, string>;

interface FriendsProps{
  users: UserBioMap
}

export default function FindFriends(props: FriendsProps) {
  return (
    <div className="friend_list">
      {Object.keys(props.users).map((user) => (
        <User key={user} name={user} />
      ))}
    </div>
  );
}
