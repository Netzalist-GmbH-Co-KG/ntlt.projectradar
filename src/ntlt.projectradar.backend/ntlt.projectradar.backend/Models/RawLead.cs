using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class RawLead
{
    [Key] public Guid Id { get; set; }

    [Required] public string OriginalContent { get; set; } = string.Empty;

    [Required] public DateTime UploadedAt { get; set; }

    [Required] public ProcessingStatus ProcessingStatus { get; set; } = ProcessingStatus.Processing;
}

public enum ProcessingStatus
{
    Processing,
    Completed,
    Failed
}