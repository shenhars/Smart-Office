using MongoDB.Driver; // This enables .Find() and .InsertOneAsync()
using MongoDB.Driver.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ResourceService.Models;
using ResourceService.Data;
using ResourceService.Services;

namespace ResourceService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires a valid JWT for any access
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetsController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asset>>> Get()
        {
            var assets = await _assetService.GetAllAsync();
            return Ok(assets);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // RBAC: Only Admins can add assets
        public async Task<IActionResult> Post([FromBody] Asset asset)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _assetService.CreateAsync(asset);
                return Ok(created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { error = ex.Message });
            }
        }
    }
}