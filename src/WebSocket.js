import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');  // Use your server URL when deployed
export default socket;
