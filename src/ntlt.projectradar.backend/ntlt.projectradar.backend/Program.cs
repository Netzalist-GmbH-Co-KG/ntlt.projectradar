using Serilog;
using Microsoft.EntityFrameworkCore;
using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Services;

// Configure Serilog from appsettings.json
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", true)
        .Build())
    .CreateLogger();

try
{
    Log.Information("Starting ProjectRadar Backend");

    var builder = WebApplication.CreateBuilder(args);

    // Replace built-in logging with Serilog
    builder.Host.UseSerilog();    // Add services to the container.
    builder.Services.AddControllers();    // Add Entity Framework and SQLite
    builder.Services.AddDbContext<ProjectRadarContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

    // Add Services
    builder.Services.AddScoped<IRawLeadService, RawLeadService>();
    builder.Services.AddTransient<IGuidService, GuidService>();

    // Add CORS for local development
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowLocalhost", policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    // Add Serilog request logging
    app.UseSerilogRequestLogging();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        
        // Enable CORS in development
        app.UseCors("AllowLocalhost");
    }
    else
    {
        // Only use HTTPS redirection in production
        app.UseHttpsRedirection();
    }

    app.UseAuthorization();

    app.MapControllers();

    Log.Information("ProjectRadar Backend started successfully");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "ProjectRadar Backend failed to start");
}
finally
{
    Log.CloseAndFlush();
}