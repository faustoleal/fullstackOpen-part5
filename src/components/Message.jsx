const Message = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="message">{message}</div>;
};

export default Message;
