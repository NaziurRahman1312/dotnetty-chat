import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import mockData from "../helpers/mockData";
import Chat from "./Chat";

export default function MessageContainer() {
  const [messages, setMessages] = useState(mockData());

  const sendMessage = (innerHtml, textContent, innerText) => {
    setMessages([
      ...messages,
      { message: innerText, sentTime: new Date(), sender: "Emily" },
    ]);
  };

  return (
    <MainContainer>
      <ChatContainer>
        <MessageList
          typingIndicator={<TypingIndicator content="Emily is typing" />}
        >
          <MessageList.Content>
            <Chat data={messages} />
          </MessageList.Content>
        </MessageList>
        <MessageInput onSend={sendMessage} placeholder="Type message here" />
      </ChatContainer>
    </MainContainer>
  );
}
