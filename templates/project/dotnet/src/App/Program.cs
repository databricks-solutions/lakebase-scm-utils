using App.Data;
using App.Lakebase;

// Load .env from the repo root so the Lakebase connection metadata written by
// the post-checkout hook is available however the app is started. Variables
// already set in the environment (CI secrets, Docker --env) always win.
DotEnv.LoadFromRepoRoot();

var builder = WebApplication.CreateBuilder(args);

// One process-wide data source: a single connection pool whose password is a
// short-lived Lakebase credential refreshed in the background.
builder.Services.AddLakebaseDbContext<AppDbContext>();

// OpenAPI description of the endpoints, browsable at /docs (like the Node template).
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi("/openapi.json");
app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "docs";
    options.SwaggerEndpoint("/openapi.json", "API");
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// Register API endpoints above this line.

app.Run();

// Exposed for WebApplicationFactory<Program> in tests.
public partial class Program;
