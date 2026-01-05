using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class LoginDto
    {
        // Either email or name may be provided for login; at least one is required.
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        // Optional: login by username
        public string Name { get; set; } = string.Empty;
    }
}