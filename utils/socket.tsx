import { io } from "socket.io-client";
let socket;

const initializeSocket = () => {
    socket = io("https://realtime-chat-app-server-88535f0d324c.herokuapp.com");
};

export { initializeSocket, socket };