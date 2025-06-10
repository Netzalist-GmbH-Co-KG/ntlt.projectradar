using Microsoft.EntityFrameworkCore;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Data;

public class ProjectRadarContext : DbContext
{
    public ProjectRadarContext(DbContextOptions<ProjectRadarContext> options)
        : base(options)
    {
    }

    public DbSet<RawLead> RawLeads { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure RawLead entity
        modelBuilder.Entity<RawLead>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();
            
            entity.Property(e => e.OriginalContent)
                .IsRequired()
                .HasMaxLength(int.MaxValue); // For large .eml files
            
            entity.Property(e => e.UploadedAt)
                .IsRequired();
            
            entity.Property(e => e.ProcessingStatus)
                .IsRequired()
                .HasConversion<string>(); // Store enum as string in database
        });
    }
}
