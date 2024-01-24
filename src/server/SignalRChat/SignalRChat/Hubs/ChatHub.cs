using Microsoft.AspNetCore.SignalR;
using SignalRChat.Data;
using SignalRChat.Models;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        #region Fields

        private readonly ICosmosDbContext _cosmosDbContext;

        #endregion

        #region Ctors
        public ChatHub(ICosmosDbContext cosmosDbContext)
        {
            _cosmosDbContext = cosmosDbContext;
        }
        #endregion

        #region Methods
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = await _cosmosDbContext.GetUserByConnectionId(Context.ConnectionId);
            if (user != null)
            {
                await _cosmosDbContext.DeleteUserByConnectionId(Context.ConnectionId);
                await Clients.Group(MagicStrings.Room).SendAsync("ReceiveMessage", GenerateBotMessage($"{user.Name} has left"));
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(User user)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, MagicStrings.Room);

            await _cosmosDbContext.AddNewConnection(Context.ConnectionId, user);

            await Clients.Group(MagicStrings.Room).SendAsync("ReceiveMessage", GenerateBotMessage($"{user.Name} has joined {MagicStrings.Room}"));
        }

        public async Task SendMessage(string message)
        {
            var user = await _cosmosDbContext.GetUserByConnectionId(Context.ConnectionId);
            if (user != null)
            {
                await Clients.Caller
                             .SendAsync("ReceiveMessage", GenerateUserMessage(user, message, Direction.Outgoing));

                await Clients.GroupExcept(MagicStrings.Room, Context.ConnectionId)
                             .SendAsync("ReceiveMessage", GenerateUserMessage(user, message));
            }
        }

        private MessageInfo GenerateBotMessage(string message)
        {
            return new MessageInfo
            {
                Name = MagicStrings.Bot_User,
                Avatar = MagicStrings.Bot_User,
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
