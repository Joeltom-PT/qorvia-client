import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface Comment {
  username: string;
  content: string;
}

const CommentComponent: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('');  

  useEffect(() => {
    const socket = new SockJS('http://localhost:8882/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      // Subscribe to the comments topic
      stompClient.subscribe('/topic/comments', (msg: any) => {
        setComments((prev) => [...prev, JSON.parse(msg.body)]);
      });

      // Subscribe to the viewers topic
      stompClient.subscribe('/topic/viewers', (msg: any) => {
        setViewerCount(JSON.parse(msg.body));
      });
    });

    return () => {
      stompClient.disconnect(() => {
        console.log("WebSocket connection closed");
      });
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '' && username.trim() !== '') {
      const newComment = { username, content: message };
      const socket = new SockJS('http://localhost:8882/ws');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, () => {
        stompClient.send('/app/comments', {}, JSON.stringify(newComment));
        setMessage('');
      });
    }
  };

  return (
    <div>
      <div>
        <h3>Comments</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}><strong>{comment.username}:</strong> {comment.content}</li>
          ))}
        </ul>
        <p>Viewers: {viewerCount}</p>
      </div>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a comment"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CommentComponent;
