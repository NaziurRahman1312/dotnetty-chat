using Microsoft.AspNetCore.SignalR;
using SignalRChat.Models;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        #region Fields
        private const string Room = "LetsChat";
        private const string Bot_User = "Bot";

        private readonly IDictionary<string, User> _connections;

        #endregion

        #region Ctors
        public ChatHub(IDictionary<string, User> connections)
        {
            _connections = connections;
        }
        #endregion

        #region Methods
        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out User user))
            {
                _connections.Remove(Context.ConnectionId);
                Clients.Group(Room).SendAsync("ReceiveMessage", GenerateBotMessage($"{user.Name} has left"));
            }

            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(User user)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, Room);

            _connections[Context.ConnectionId] = user;

            await Clients.Group(Room).SendAsync("ReceiveMessage", GenerateBotMessage($"{user.Name} has joined {Room}"));
        }

        public async Task SendMessage(string message)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out User user))
            {
                await Clients.Caller
                             .SendAsync("ReceiveMessage", GenerateUserMessage(user, message, Direction.Outgoing));

                await Clients.GroupExcept(Room, Context.ConnectionId)
                             .SendAsync("ReceiveMessage", GenerateUserMessage(user, message));
            }
        }

        private MessageInfo GenerateBotMessage(string message)
        {
            return new MessageInfo
            {
                Name = Bot_User,
                Avatar = Bot_User,
                Direction = Direction.Incoming.ToString().ToLower(),
                Message = message,
                SentTime = DateTime.UtcNow
            };
        }

        private MessageInfo GenerateUserMessage(User user, string message, Direction direction = Direction.Incoming)
        {
            return new MessageInfo
            {
                Name = user.Name,
                Avatar = user.Avatar,
                Direction = direction.ToString().ToLower(),
                Message = message,
                SentTime = DateTime.UtcNow
            };
        }
        #endregion
    }
}
