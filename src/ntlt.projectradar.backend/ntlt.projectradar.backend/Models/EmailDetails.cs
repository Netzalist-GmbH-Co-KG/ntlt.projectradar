using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class EmailDetails
{
    [Key] public Guid Id { get; set; }

    [Required] public Guid RawLeadId { get; set; }

    public string EmailFrom { get; set; } = string.Empty;

    public string EmailTo { get; set; } = string.Empty;

    public string EmailSubject { get; set; } = string.Empty;

    public DateTime? EmailDate { get; set; }

    public string EmailBodyText { get; set; } = string.Empty;

    public string EmailBodyHtml { get; set; } = string.Empty;

    [Required] public DateTime CreatedAt { get; set; }

    public ICollection<EmailAttachment> Attachments { get; set; } = new List<EmailAttachment>();
}