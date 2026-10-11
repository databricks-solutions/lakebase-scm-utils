using App.Lakebase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace App.Data;

/// <summary>
/// Used by `dotnet ef` (and the kit's lakebase-schema-migrate) to build the
/// DbContext without starting the web host. It reads the same connection
/// settings as the app: DATABASE_URL when set (the kit passes the target
/// branch DSN this way, so no password appears on a command line), otherwise
/// the Lakebase metadata in .env with a runtime-minted credential.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        DotEnv.LoadFromRepoRoot();
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(LakebaseConnection.CreateDataSource())
            .Options;
        return new AppDbContext(options);
    }
}
