using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Scripts;
using SignalRChat.Models;

namespace SignalRChat.Data
{
    public class CosmosDbContext : ICosmosDbContext, IDisposable
    {
        #region Fields

        private readonly CosmosClient _client;

        #endregion

        #region Ctor

        public CosmosDbContext(IConfiguration configuration)
        {
            CosmosClientOptions options = new()
            {
                HttpClientFactory = () => new HttpClient(new HttpClientHandler()
                {
                    ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                }),
                ConnectionMode = ConnectionMode.Gateway,
                LimitToEndpoint = true
            };

            _client = new(accountEndpoint: configuration.GetValue<string>("accountEndpoint"),
                          authKeyOrResourceToken: configuration.GetValue<string>("authKeyOrResourceToken"),
                          clientOptions: options);
        }

        #endregion

        #region Methods

        public async Task AddNewConnection(string connectionId, Models.User user)
        {
            var container = await GetContainer();

            try
            {
                await container.Scripts.DeleteTriggerAsync("validateConnectionItemTimestamp");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            try
            {
                await container.Scripts.CreateTriggerAsync(new TriggerProperties
                {
                    Id = "validateConnectionItemTimestamp",
                    Body = File.ReadAllText(".\\Data\\Trigger\\Pre\\validateConnectionItemTimestamp.js"),
                    TriggerOperation = TriggerOperation.Upsert,
                    TriggerType = TriggerType.Pre
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            var item = new
            {
                id = connectionId,
                name = user.Name,
                avatar = user.Avatar,
                room = MagicStrings.Room
            };

            try
            {
                await container.UpsertItemAsync(item, requestOptions: new ItemRequestOptions { PreTriggers = new List<string> { "validateConnectionItemTimestamp" } });

            }
            catch (Exception ex)
            {
            }
        }

        public async Task<Models.User> GetUserByConnectionId(string connectionId)
        {
            var container = await GetContainer();

            Models.User user = await container.ReadItemAsync<Models.User>(id: connectionId,
                partitionKey: new PartitionKey(MagicStrings.Room));

            return user;
        }

        public async Task DeleteUserByConnectionId(string connectionId)
        {
            var container = await GetContainer();

            await container.DeleteItemAsync<Models.User>(id: connectionId,
                partitionKey: new PartitionKey(MagicStrings.Room));
        }

        private async Task<Container> GetContainer()
        {
            Database database = await _client.CreateDatabaseIfNotExistsAsync(
                   id: "cosmicchat",
                   throughput: 400);

            return await database.CreateContainerIfNotExistsAsync(
                  id: "connections",
                  partitionKeyPath: "/room");
        }

        public void Dispose()
        {
            _client?.Dispose();
        }

        #endregion
    }
}
