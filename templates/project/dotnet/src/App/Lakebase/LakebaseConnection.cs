using System.Diagnostics;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Npgsql;

namespace App.Lakebase;

/// <summary>
/// Builds the app's Postgres connection. Credentials are minted at RUNTIME, never
/// stored in .env: the data source is built from connection METADATA
/// (LAKEBASE_HOST, LAKEBASE_PROJECT_ID, LAKEBASE_BRANCH_ID, DB_USERNAME) and a
/// periodic password provider injects a short-lived Lakebase credential minted by
/// the databricks CLI (the same credential source as the Python and Node templates).
///
/// An explicit DATABASE_URL (CI secret, Docker, the kit's ephemeral-verify DSN)
/// OVERRIDES this and is used verbatim. postgresql:// URLs and Npgsql
/// "Host=...;" strings are both accepted.
/// </summary>
public static class LakebaseConnection
{
    // Lakebase credentials live ~1h; re-mint after 40 min so a new physical
    // connection never presents an expired token.
    private static readonly TimeSpan MintTtl = TimeSpan.FromMinutes(40);
    private static readonly SemaphoreSlim MintLock = new(1, 1);
    private static string? _cachedToken;
    private static DateTime _mintedAt = DateTime.MinValue;

    /// <summary>
    /// Registers one process-wide NpgsqlDataSource and a DbContext that uses it.
    /// Never build a data source per DbContext: that creates a new pool and mints a
    /// new credential on every request.
    /// </summary>
    public static IServiceCollection AddLakebaseDbContext<TContext>(this IServiceCollection services)
        where TContext : DbContext
    {
        services.TryAddSingleton(_ => CreateDataSource());
        services.AddDbContext<TContext>((sp, options) =>
            options.UseNpgsql(sp.GetRequiredService<NpgsqlDataSource>()));
        return services;
    }

    /// <summary>Data source for the app (and the EF Core design-time factory).</summary>
    public static NpgsqlDataSource CreateDataSource()
    {
        var explicitUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (!string.IsNullOrWhiteSpace(explicitUrl))
            return NpgsqlDataSource.Create(Normalize(new NpgsqlConnectionStringBuilder(ToNpgsql(explicitUrl))).ConnectionString);

        var host = Env("LAKEBASE_HOST") ?? Env("DB_HOST");
        var endpoint = EndpointPathFromEnv();
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = host ?? "localhost",
            Port = 5432,
            Database = Env("DB_NAME") ?? "databricks_postgres",
        };

        if (host is null || endpoint is null)
            return NpgsqlDataSource.Create(Normalize(builder).ConnectionString); // pure-local fallback

        // Resolve the user without failing here: design-time commands such as
        // `dotnet ef migrations add` build a data source but never connect, so
        // an offline or expired CLI session must only fail when a connection
        // is actually opened.
        Exception? userError = null;
        var user = Env("DB_USERNAME");
        if (user is null)
        {
            try { user = CurrentUser(); }
            catch (Exception ex) { userError = ex; }
        }

        builder.Username = user ?? "unresolved-lakebase-user";
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(Normalize(builder).ConnectionString);
        dataSourceBuilder.UsePeriodicPasswordProvider(
            async (_, ct) => userError is null
                ? await MintTokenAsync(endpoint, ct)
                : throw new InvalidOperationException(
                    "Could not resolve the Lakebase user. Set DB_USERNAME in .env or run 'databricks auth login'.", userError),
            successRefreshInterval: TimeSpan.FromMinutes(5),
            failureRefreshInterval: TimeSpan.FromSeconds(10));
        return dataSourceBuilder.Build();
    }

    /// <summary>projects/&lt;id&gt;/branches/&lt;branch&gt;/endpoints/&lt;endpoint&gt;, or null without metadata.</summary>
    public static string? EndpointPathFromEnv()
    {
        var project = Env("LAKEBASE_PROJECT_ID");
        var branch = Env("LAKEBASE_BRANCH_ID");
        if (project is null || branch is null)
            return null;
        return $"projects/{project}/branches/{branch}/endpoints/{Env("LAKEBASE_ENDPOINT") ?? "primary"}";
    }

    /// <summary>Convert a postgresql:// URL to an Npgsql connection string; pass Npgsql strings through.</summary>
    public static string ToNpgsql(string databaseUrl)
    {
        var raw = databaseUrl.Trim();
        if (!raw.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
            && !raw.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
            return raw;

        var uri = new Uri(raw);
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/')),
        };
        var userInfo = uri.UserInfo.Split(':', 2);
        if (userInfo[0].Length > 0)
            builder.Username = Uri.UnescapeDataString(userInfo[0]);
        if (userInfo.Length > 1)
            builder.Password = Uri.UnescapeDataString(userInfo[1]);

        foreach (var pair in uri.Query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = pair.Split('=', 2);
            var value = kv.Length > 1 ? Uri.UnescapeDataString(kv[1]) : "";
            switch (kv[0].ToLowerInvariant())
            {
                case "sslmode":
                    builder.SslMode = value.ToLowerInvariant() switch
                    {
                        "disable" => SslMode.Disable,
                        "allow" => SslMode.Allow,
                        "prefer" => SslMode.Prefer,
                        "verify-ca" => SslMode.VerifyCA,
                        "verify-full" => SslMode.VerifyFull,
                        _ => SslMode.Require,
                    };
                    break;
                case "application_name":
                    builder.ApplicationName = value;
                    break;
            }
        }

        return builder.ConnectionString;
    }

    // TLS on and a non-empty application_name, so every connection is
    // identifiable in pg_stat_activity.
    private static NpgsqlConnectionStringBuilder Normalize(NpgsqlConnectionStringBuilder builder)
    {
        var weakTls = builder.SslMode is SslMode.Disable or SslMode.Allow or SslMode.Prefer;
        if (weakTls && builder.Host != "localhost")
            builder.SslMode = SslMode.Require;
        if (string.IsNullOrEmpty(builder.ApplicationName))
        {
            var consort = Env("CONSORT_VERSION");
            builder.ApplicationName = Env("PGAPPNAME")
                ?? (consort is not null ? $"consort/{consort}" : "scm-utils/{{LAKEBASE_SCM_UTILS_VERSION}}");
        }

        return builder;
    }

    private static async Task<string> MintTokenAsync(string endpoint, CancellationToken ct)
    {
        await MintLock.WaitAsync(ct);
        try
        {
            if (_cachedToken is not null && DateTime.UtcNow - _mintedAt < MintTtl)
                return _cachedToken;

            var json = await RunDatabricksAsync(["postgres", "generate-database-credential", endpoint, "-o", "json"], ct);
            using var doc = JsonDocument.Parse(json);
            _cachedToken = doc.RootElement.GetProperty("token").GetString()
                ?? throw new InvalidOperationException($"generate-database-credential returned no token for {endpoint}");
            _mintedAt = DateTime.UtcNow;
            return _cachedToken;
        }
        finally
        {
            MintLock.Release();
        }
    }

    private static string CurrentUser()
    {
        var json = RunDatabricksAsync(["current-user", "me", "-o", "json"], CancellationToken.None).GetAwaiter().GetResult();
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("userName").GetString()
            ?? throw new InvalidOperationException("databricks current-user me returned no userName; set DB_USERNAME in .env");
    }

    private static async Task<string> RunDatabricksAsync(IEnumerable<string> args, CancellationToken ct)
    {
        var psi = new ProcessStartInfo("databricks")
        {
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
        };
        foreach (var arg in args)
            psi.ArgumentList.Add(arg);
        if (Env("DATABRICKS_CONFIG_PROFILE") is { } profile)
        {
            psi.ArgumentList.Add("--profile");
            psi.ArgumentList.Add(profile);
        }

        using var process = Process.Start(psi)
            ?? throw new InvalidOperationException("Could not start the databricks CLI. Is it installed and on PATH?");
        var stdout = process.StandardOutput.ReadToEndAsync(ct);
        var stderr = process.StandardError.ReadToEndAsync(ct);
        await process.WaitForExitAsync(ct);
        if (process.ExitCode != 0)
        {
            var err = (await stderr).Trim();
            var hint = err.Contains("auth login", StringComparison.OrdinalIgnoreCase)
                || err.Contains("refresh token", StringComparison.OrdinalIgnoreCase)
                    ? " Run 'databricks auth login' to re-authenticate."
                    : "";
            throw new InvalidOperationException($"databricks {string.Join(' ', psi.ArgumentList)} failed: {err}{hint}");
        }

        return await stdout;
    }

    private static string? Env(string name)
        => Environment.GetEnvironmentVariable(name) is { Length: > 0 } value ? value : null;
}
