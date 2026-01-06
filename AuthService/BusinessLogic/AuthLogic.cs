using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Models;

namespace AuthService.BusinessLogic
{
    public static class AuthLogic
    {
        public static string GenerateJwtToken(ApplicationUser user, IConfiguration _config)
        {
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id), 
                new Claim(ClaimTypes.Role, user.Role)
            };

            var keyBytes = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "Your_Super_Secret_Key_At_Least_32_Chars");
            var authSigningKey = new SymmetricSecurityKey(keyBytes);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}