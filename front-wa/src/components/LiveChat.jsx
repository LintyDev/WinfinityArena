import { Form } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import useSocket from '../hooks/useSocket';
import useAuth from '../hooks/useAuth';
import chatIcon from '../assets/icons/chat.svg';
import sendIcon from '../assets/icons/send.svg';


const LiveChat = () => {
  const chatRef = useRef(null);
  const messageRef = useRef(null);
  const displayMessageChat = useRef(null);
  const { socket } = useSocket();
  const { auth } = useAuth();
  const [messageChat, setMessageChat] = useState('');
  const [contentChat, setContentChat] = useState([]);


  const handleMessageChat = (e) => {
    e.preventDefault();
    socket.emit('chat_message', { message: messageChat.toString(), username: auth.username });
    setMessageChat('');
    messageRef.current.value = "";
  };

  const handleAddMessageContent = ({ message, username }) => {
    setContentChat(prev => {
      const messageId = (prev.length + 1);
      const messageForm = (
        <div key={messageId} className="messageChat">

          <div className="d-flex headerMessageChat">
            <span>{username}:</span>
            <p>&nbsp;{message}</p>
          </div>
        </div>
      );
      return [...prev, messageForm];
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on('chat_message', (message, username) => {
        handleAddMessageContent(message, username);
      });
    }
    return () => {
      if (socket) {
        socket.off('chat_message');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    const chatContent = chatRef.current;
    chatContent.scrollTop = chatContent.scrollHeight;

  });
  return (
    <div className="LiveChat">
      <div className="headerChat d-flex">
        <img
          alt=""
          src={chatIcon}
          width="32"
          height="32"
          className='colorIcons'
        />
        <h3>ArenaChat</h3>
      </div>
      <hr />
      <div className="contentChat" ref={chatRef}>
        <p ref={displayMessageChat} style={{ textAlign: 'center' }}>Welcome to the Chat !</p>
        {contentChat.map(content => content)}
      </div>

      <div className="footerChat d-flex align-items-center" >
        <Form className='d-flex w-100' onSubmit={(e) => { handleMessageChat(e)}}>
          <Form.Control
            ref={messageRef}
            as="textarea"
            rows={2}
            placeholder='Envoyer un message'
            onChange={(e) => { setMessageChat(e.target.value) }}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                handleMessageChat(e);
              }
            }}
          />
          <button className="imgBtn" type='submit' onClick={(e) => {handleMessageChat(e)}}>
            <img
              alt=""
              src={sendIcon}
              width="32"
              height="32"
              className='colorIcons'
            />
          </button>
        </Form>
      </div>
    </div>
  )
}

export default LiveChat