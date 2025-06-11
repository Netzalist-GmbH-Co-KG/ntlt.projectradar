using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.DTOs;

/// <summary>
/// DTO for email attachment information (without content)
/// </summary>
public class EmailAttachmentListDto
{
    public Guid Id { get; set; }
    public string AttachmentFilename { get; set; } = string.Empty;
    public string AttachmentMimeType { get; set; } = string.Empty;
}

/// <summary>
/// DTO for paginated email list view
/// </summary>
public class EmailListDto
{
    public Guid Id { get; set; }
    public string EmailFrom { get; set; } = string.Empty;
    public string EmailTo { get; set; } = string.Empty;
    public string EmailSubject { get; set; } = string.Empty;
    public DateTime? EmailDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool HasAttachments { get; set; }
    public IEnumerable<EmailAttachmentListDto> Attachments { get; set; } = new List<EmailAttachmentListDto>();
}

/// <summary>
/// DTO for paginated email list response
/// </summary>
public class EmailListResponseDto
{
    public IEnumerable<EmailListDto> Emails { get; set; } = new List<EmailListDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}
