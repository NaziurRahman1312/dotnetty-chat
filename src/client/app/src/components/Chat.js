import { Avatar, Message, MessageGroup } from "@chatscope/chat-ui-kit-react";
import { getAvatarSrc } from "../helpers/utils";
import { Fragment } from "react";

function getReplyBody(user, replies) {
  var body = replies.map((reply, idx) => {
    return (
      <Fragment key={idx}>
        <Message
          model={{
            message: reply.content,
            sentTime: reply.sentTime,
            sender: user,
          }}
        />
      </Fragment>
    );
  });

  return <>{body}</>;
}

function getMessageGroup(data) {
  const messageGrps = [];
  data.forEach((element, idx) => {
    if (
      messageGrps.length == 0 ||
      messageGrps[messageGrps.length - 1].user !== element.sender
    ) {
      var group = {
        user: element.sender,
        replies: [
          {
            content: element.message,
            sentTime: element.sentTime,
          },
        ],
      };
      messageGrps.push(group);
    } else {
      messageGrps[messageGrps.length - 1].replies.push({
        content: element.message,
        sentTime: element.sentTime,
      });
    }
  });

  return messageGrps;
}

export default function Chat({ data }) {
  var chatList = getMessageGroup(data).map((group, idx) => {
    return (
      <MessageGroup key={idx} direction="incoming">
        <Avatar src={getAvatarSrc(group.user)} name={group.user} />
        <MessageGroup.Messages>
          {getReplyBody(group.user, group.replies)}
        </MessageGroup.Messages>
        <MessageGroup.Footer>
          {group.user + " " + group.replies[group.replies.length - 1].sentTime}
        </MessageGroup.Footer>
      </MessageGroup>
    );
  });

  return <>{chatList}</>;
}
