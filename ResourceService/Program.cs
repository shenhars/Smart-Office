using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ResourceService.Data; // Ensure this matches your folder
using ResourceService.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Register MongoDB Context as a Singleton
builder.Services.AddSingleton<MongoDbContext>();

// 2. Configure JWT Validation (Crucial for Resource Security)
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "Your_Super_Secret_Key_At_Least_32_Chars!");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true
    };
});

// Add CORS policy for local frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

builder.Services.AddControllers();

// Register asset service for business logic
builder.Services.AddScoped<ResourceService.Services.IAssetService, ResourceService.Services.AssetService>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();