using Microsoft.EntityFrameworkCore;

namespace App.Data;

/// <summary>
/// Application DbContext. Add DbSet&lt;TEntity&gt; properties for your tables.
/// Schema changes go through migrations (see the project README), never
/// EnsureCreated().
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
}
