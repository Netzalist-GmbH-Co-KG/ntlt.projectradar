using ntlt.projectradar.backend.DTOs;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public interface IEmailService
{
    /// <summary>
    /// Get paginated list of emails ordered by date descending
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of emails per page</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated email list response</returns>
    Task<EmailListResponseDto> GetEmailsAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get detailed information for a specific email by ID
    /// </summary>
    /// <param name="id">Email ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Email details or null if not found</returns>
    Task<EmailDetailsDto?> GetEmailByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get attachment content by attachment ID
    /// </summary>
    /// <param name="attachmentId">Attachment ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Attachment or null if not found</returns>
    Task<EmailAttachment?> GetAttachmentByIdAsync(Guid attachmentId, CancellationToken cancellationToken = default);
}
