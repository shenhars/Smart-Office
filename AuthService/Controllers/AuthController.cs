using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Models;
using AuthService.BusinessLogic;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Use email as UserName (Identity's default username restrictions disallow spaces),
            // and store the user's full name in a separate property.
            var user = new ApplicationUser { UserName = model.Email, Email = model.Email, FullName = model.Name, Role = model.Role };
            var result = await _userManager.CreateAsync(user, model.Password); // Hashed automatically 

            if (result.Succeeded) return Ok("User registered successfully");
            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ApplicationUser? user = null;

            // Allow login by email or by username
            if (!string.IsNullOrWhiteSpace(model.Email))
            {
                user = await _userManager.FindByEmailAsync(model.Email);
            }

            if (user == null && !string.IsNullOrWhiteSpace(model.Name))
            {
                user = await _userManager.FindByNameAsync(model.Name);
            }

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = AuthLogic.GenerateJwtToken(user, _config); // Issues token with claims
                return Ok(new { token });
            }

            return Unauthorized();
        }
    }
}