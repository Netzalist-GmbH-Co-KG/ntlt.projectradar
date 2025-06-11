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
    public DbSet<EmailDetails> EmailDetails { get; set; } = null!;
    public DbSet<EmailAttachment> EmailAttachments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Configure RawLead entity
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

        // Configure EmailDetails entity
        modelBuilder.Entity<EmailDetails>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.RawLeadId)
                .IsRequired();

            entity.Property(e => e.EmailFrom)
                .HasMaxLength(500);

            entity.Property(e => e.EmailTo)
                .HasMaxLength(500);

            entity.Property(e => e.EmailSubject)
                .HasMaxLength(1000);

            entity.Property(e => e.EmailBodyText)
                .HasMaxLength(int.MaxValue);

            entity.Property(e => e.EmailBodyHtml)
                .HasMaxLength(int.MaxValue);

            entity.Property(e => e.CreatedAt)
                .IsRequired();
        });

        // Configure EmailAttachment entity
        modelBuilder.Entity<EmailAttachment>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.EmailDetailsId)
                .IsRequired();

            entity.Property(e => e.AttachmentFilename)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.AttachmentMimeType)
                .HasMaxLength(200);

            entity.Property(e => e.AttachmentContent)
                .HasMaxLength(int.MaxValue);

            entity.Property(e => e.CreatedAt)
                .IsRequired();
        });
    }
}