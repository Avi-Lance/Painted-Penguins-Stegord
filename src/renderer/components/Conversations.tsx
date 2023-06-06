interface ChatData {
  friends: Record<string, string>;
  groups: Record<string, string>;
}

interface ChildComponentProps {
  chatData: ChatData;
}

export default function Conversations({ chatData }: ChildComponentProps) {
  return (
    <div>
      <h2>Friends:</h2>
      <ul>
        {Object.entries(chatData.friends).map(([chatId, username]) => (
          <li key={chatId}>
            Chat ID: {chatId}, Username: {username}
          </li>
        ))}
      </ul>

      <h2>Groups:</h2>
      <ul>
        {Object.entries(chatData.groups).map(([chatId, chatName]) => (
          <li key={chatId}>
            Chat ID: {chatId}, Chat Name: {chatName}
          </li>
        ))}
      </ul>
    </div>
  );
}
