using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AuthService.Data;
using AuthService.Models;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://0.0.0.0:8080");

// 1. Add Database Connection (PostgreSQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Add Identity (ApplicationUser & AuthDbContext)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

// 3. Add JWT Authentication
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "SecretKeyWithAtLeast32Characters!!");
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Configure CORS to allow frontend during local development
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
    );
});

builder.Services.AddControllers();

var app = builder.Build();

// 4. Migrate Database automatically on start
using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    // Ensure DB/schema exists for development, then apply migrations if any
    try {
        // If the migrations history table exists but there are no migrations in the image,
        // drop the history table so EnsureCreated can create the schema in development.
        db.Database.ExecuteSqlRaw("DROP TABLE IF EXISTS \"__EFMigrationsHistory\"");
    } catch {
        // ignore SQL errors in restricted environments
    }

    try {
        db.Database.EnsureCreated();
    } catch {
        // ignore
    }

    try {
        db.Database.Migrate();
    } catch {
        // ignore migration errors in ephemeral/dev environments
    }

    // Development-friendly: ensure new columns exist when migrations are not present in the image.
    try {
        db.Database.ExecuteSqlRaw("ALTER TABLE \"AspNetUsers\" ADD COLUMN IF NOT EXISTS \"FullName\" text;");
    } catch {
        // ignore - best-effort only
    }
}


app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();