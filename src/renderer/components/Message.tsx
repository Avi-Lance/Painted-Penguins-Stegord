export default function Message({ author, timestamp, message }) {
  return (
    <div className="message_body">
      <div
        className={`message ${
          author === 'you' ? 'message_you' : 'message_other'
        }`}
      >
        <div className="message_meta">
          <span>{author}</span>
          <span>{timestamp}</span>
        </div>
        <div className="message_text">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
