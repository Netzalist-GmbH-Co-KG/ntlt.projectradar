using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class EmailAttachment
{
    [Key] public Guid Id { get; set; }

    [Required] public Guid EmailDetailsId { get; set; }

    [Required] public string AttachmentFilename { get; set; } = string.Empty;

    public string AttachmentMimeType { get; set; } = string.Empty;

    public string AttachmentContent { get; set; } = string.Empty;

    [Required] public DateTime CreatedAt { get; set; }
}