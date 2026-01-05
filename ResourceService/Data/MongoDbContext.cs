using MongoDB.Driver;
using ResourceService.Models;

namespace ResourceService.Data
{
    public class MongoDbContext
    {
        public IMongoCollection<Asset> Assets { get; }

        public MongoDbContext(IConfiguration configuration)
        {
            // Gets connection string from docker-compose environment variables
            var client = new MongoClient(configuration.GetConnectionString("MongoConnection"));
            var database = client.GetDatabase("SmartOfficeResources");
            Assets = database.GetCollection<Asset>("Assets");
        }
    }
}