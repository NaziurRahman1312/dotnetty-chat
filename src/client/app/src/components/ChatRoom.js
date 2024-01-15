import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { Button, Container, Grid } from "@mui/material";
import Chat from "./Chat";

export default function ChatRoom({ messages, user, send, leave }) {
  return (
    <Container maxWidth="lg">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        spacing={1}
      >
        <Grid item>
          <Button variant="contained" color="error" onClick={() => leave()}>
            Leave Room
          </Button>
        </Grid>
        <Grid item>
          <div className="message-container">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  typingIndicator={
                    <TypingIndicator content="Emily is typing" />
                  }
                >
                  <MessageList.Content>
                    <Chat data={messages} />
                  </MessageList.Content>
                </MessageList>
                <MessageInput onSend={send} placeholder="Type message here" />
              </ChatContainer>
            </MainContainer>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
