using Microsoft.AspNetCore.Identity;

namespace AuthService.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Add custom properties if needed, otherwise keep it empty
        public string Role { get; set; } = "Member";
        public string FullName { get; set; } = string.Empty;
    }
}