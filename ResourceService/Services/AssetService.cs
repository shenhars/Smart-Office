using MongoDB.Driver;
using ResourceService.Data;
using ResourceService.Models;

namespace ResourceService.Services
{
    public class AssetService : IAssetService
    {
        private readonly MongoDbContext _context;

        public AssetService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<List<Asset>> GetAllAsync()
        {
            return await _context.Assets.Find(_ => true).ToListAsync();
        }

        public async Task<Asset> CreateAsync(Asset asset)
        {
            // Business rule: Asset name/type must be provided
            asset.Name = asset.Name?.Trim() ?? string.Empty;
            asset.Type = asset.Type?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(asset.Name) || string.IsNullOrWhiteSpace(asset.Type))
            {
                throw new ArgumentException("Asset name and type are required.");
            }

            // Business rule: prevent exact duplicate (same name and type)
            var existing = await _context.Assets.Find(a => a.Name == asset.Name && a.Type == asset.Type).FirstOrDefaultAsync();
            if (existing != null)
            {
                throw new InvalidOperationException("An asset with the same name and type already exists.");
            }

            await _context.Assets.InsertOneAsync(asset);
            return asset;
        }
    }
}
