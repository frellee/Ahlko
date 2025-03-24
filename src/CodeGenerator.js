import React, { useState } from 'react';
import socket from './WebSocket';

const CodeGenerator = ({ onJoin }) => {
  const [code, setCode] = useState('');
  
  const createRoom = () => {
    socket.emit('createRoom');
    socket.on('roomCreated', (roomCode) => {
      setCode(roomCode);
      onJoin(roomCode);
    });
  };

  const joinRoom = () => {
    socket.emit('joinRoom', code);
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <input
        type="text"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default CodeGenerator;
