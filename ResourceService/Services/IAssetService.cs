using ResourceService.Models;
namespace ResourceService.Services
{
    public interface IAssetService
    {
        Task<List<Asset>> GetAllAsync();
        Task<Asset> CreateAsync(Asset asset);
    }
}
