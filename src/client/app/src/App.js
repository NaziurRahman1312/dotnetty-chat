import ChatRoom from "./components/ChatRoom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Lobby from "./components/Lobby";
import { useState } from "react";
import config from "./config";

export default function Chatscope() {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinRoom = async (user) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(config.chatApi)
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (messageInfo) => {
        let info = {
          message: messageInfo.message,
          sentTime: messageInfo.sentTime,
          sender: messageInfo.name,
          avatar: messageInfo.avatar,
          direction: messageInfo.direction,
        };
        setMessages((messages) => [...messages, info]);
      });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
      });

      await connection.start();
      await connection.invoke("JoinRoom", user);
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (innerHtml, textContent, innerText) => {
    try {
      await connection.invoke("SendMessage", innerText);
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
          send={sendMessage}
          leave={closeConnection}
        />
      )}
    </>
  );
}
