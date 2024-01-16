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
        avatar: element.avatar,
        direction: element.direction,
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
      <MessageGroup key={idx} direction={group.direction}>
        <Avatar src={getAvatarSrc(group.avatar)} name={group.user} />
        <MessageGroup.Messages>
          {getReplyBody(group.user, group.replies)}
        </MessageGroup.Messages>
      </MessageGroup>
    );
  });

  return <>{chatList}</>;
}
