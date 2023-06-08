import Friend from './Friend';

interface ChatData {
  friends: Record<string, string>;
  groups: Record<string, string>;
  you: string;
}

interface ChildComponentProps {
  chatData: ChatData;
}

/*
<li key={chatId}>
  Chat ID: {chatId}, Username: {username}
</li>
*/

export default function Conversations({ chatData }: ChildComponentProps) {

  return (
    <>
      <h2>Friends:</h2>
      <div className="friend_list">
        {Object.entries(chatData.friends).map(([chatId, username]) => (
          <Friend
            key={chatId}
            chatId={chatId}
            name={username}
          />
        ))}
      </div>

      <h2>Groups:</h2>
      <ul>
        {Object.entries(chatData.groups).map(([chatId, chatName]) => (
          <li key={chatId}>
            Chat ID: {chatId}, Chat Name: {chatName}
          </li>
        ))}
      </ul>
    </>
  );
}
