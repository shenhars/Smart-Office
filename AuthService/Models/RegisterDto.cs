using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Member";

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}