namespace ntlt.projectradar.backend.DTOs;

/// <summary>
/// DTO for email attachment details
/// </summary>
public class EmailAttachmentDto
{
    public Guid Id { get; set; }
    public string AttachmentFilename { get; set; } = string.Empty;
    public string AttachmentMimeType { get; set; } = string.Empty;
    public string AttachmentContent { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for detailed email view including attachments
/// </summary>
public class EmailDetailsDto
{
    public Guid Id { get; set; }
    public Guid RawLeadId { get; set; }
    public string EmailFrom { get; set; } = string.Empty;
    public string EmailTo { get; set; } = string.Empty;
    public string EmailSubject { get; set; } = string.Empty;
    public DateTime? EmailDate { get; set; }
    public string EmailBodyText { get; set; } = string.Empty;
    public string EmailBodyHtml { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public IEnumerable<EmailAttachmentDto> Attachments { get; set; } = new List<EmailAttachmentDto>();
}
