var builder = DistributedApplication.CreateBuilder(args);

var backend = builder
    .AddProject("backend", @"..\ntlt.projectradar.backend\ntlt.projectradar.backend.csproj")
    .WithExternalHttpEndpoints();

var frontend = builder.AddNpmApp("frontend", @"..\..\ntlt.projectradar.frontend", "dev")
    .WithReference(backend)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();