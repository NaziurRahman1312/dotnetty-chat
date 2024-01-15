import ChatRoom from "./components/ChatRoom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Lobby from "./components/Lobby";
import { useState } from "react";
import config from "./config";

export default function Chatscope() {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState();

  const joinRoom = async (user) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(config.chatApi)
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (messageInfo) => {
        setMessages((messages) => [...messages, messageInfo]);
      });

      connection.on("UserAdded", (userInfo) => {
        setUser(userInfo);
      });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
        setUser();
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user });
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {!connection ? (
        <Lobby joinRoom={joinRoom} />
      ) : (
        <ChatRoom
          messages={messages}
          user={user}
          send={sendMessage}
          leave={closeConnection}
        />
      )}
    </>
  );
}
