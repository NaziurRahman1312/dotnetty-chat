namespace SignalRChat.Data
{
    public interface ICosmosDbContext
    {
        Task AddNewConnection(string connectionId, Models.User user);
        Task<Models.User> GetUserByConnectionId(string connectionId);
        Task DeleteUserByConnectionId(string connectionId);
    }
}
