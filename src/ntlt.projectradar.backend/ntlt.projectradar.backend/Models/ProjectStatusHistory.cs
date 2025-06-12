using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class ProjectStatusHistory
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ProjectId { get; set; }

    [Required]
    public ProjectStatus Status { get; set; }

    [Required]
    public DateTime Timestamp { get; set; }

    public string? Comment { get; set; }

    [Required]
    public string ChangedBy { get; set; } = null!;
}
