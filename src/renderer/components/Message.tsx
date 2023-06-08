export default function Message({ you, author, message }) {

  return (
    <div className="message_body">
      <div
        className={`message ${
          author === you ? 'message_you' : 'message_other'
        }`}
      >
        <div className="message_meta">
          <h3>{author}</h3>
        </div>
        <div className="message_text">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
