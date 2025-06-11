using Microsoft.EntityFrameworkCore;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.DTOs;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public class EmailService : IEmailService
{
    private readonly ProjectRadarContext _context;
    private readonly ILogger<EmailService> _logger;

    public EmailService(ProjectRadarContext context, ILogger<EmailService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<EmailListResponseDto> GetEmailsAsync(int page = 1, int pageSize = 100,
        CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching emails for page {Page} with page size {PageSize}", page, pageSize);

        // Ensure valid pagination parameters
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.EmailDetails.AsQueryable();

        // Get total count
        var totalCount = await query.CountAsync(cancellationToken);

        // Calculate pagination
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var skip = (page - 1) * pageSize;

        // Get emails with attachments
        var emailDetails = await query
            .OrderByDescending(e => e.EmailDate ?? e.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken); // Get attachment information for these emails
        var emailIds = emailDetails.Select(e => e.Id).ToList();
        var attachments = await _context.EmailAttachments
            .Where(a => emailIds.Contains(a.EmailDetailsId))
            .Select(a => new { a.Id, a.EmailDetailsId, a.AttachmentFilename, a.AttachmentMimeType })
            .ToListAsync(cancellationToken);

        // Map to DTOs
        var emailDtos = emailDetails.Select(email =>
        {
            var emailAttachments = attachments
                .Where(a => a.EmailDetailsId == email.Id).Select(a => new EmailAttachmentListDto
                {
                    Id = a.Id,
                    AttachmentFilename = a.AttachmentFilename,
                    AttachmentMimeType = a.AttachmentMimeType
                });

            return new EmailListDto
            {
                Id = email.Id,
                EmailFrom = email.EmailFrom,
                EmailTo = email.EmailTo,
                EmailSubject = email.EmailSubject,
                EmailDate = email.EmailDate,
                CreatedAt = email.CreatedAt,
                HasAttachments = emailAttachments.Any(),
                Attachments = emailAttachments
            };
        });

        var response = new EmailListResponseDto
        {
            Emails = emailDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasNextPage = page < totalPages,
            HasPreviousPage = page > 1
        };

        _logger.LogInformation("Retrieved {Count} emails for page {Page}/{TotalPages}", emailDtos.Count(), page,
            totalPages);
        return response;
    }

    public async Task<EmailDetailsDto?> GetEmailByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching email details for ID: {EmailId}", id);

        var emailDetail = await _context.EmailDetails
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

        if (emailDetail == null)
        {
            _logger.LogWarning("Email with ID {EmailId} not found", id);
            return null;
        } // Get attachments for this email

        var attachments = await _context.EmailAttachments
            .Where(a => a.EmailDetailsId == id)
            .Select(a => new EmailAttachmentDto
            {
                Id = a.Id,
                AttachmentFilename = a.AttachmentFilename,
                AttachmentMimeType = a.AttachmentMimeType,
                AttachmentContent = a.AttachmentContent
            })
            .ToListAsync(cancellationToken);

        var emailDto = new EmailDetailsDto
        {
            Id = emailDetail.Id,
            RawLeadId = emailDetail.RawLeadId,
            EmailFrom = emailDetail.EmailFrom,
            EmailTo = emailDetail.EmailTo,
            EmailSubject = emailDetail.EmailSubject,
            EmailDate = emailDetail.EmailDate,
            EmailBodyText = emailDetail.EmailBodyText,
            EmailBodyHtml = emailDetail.EmailBodyHtml,
            CreatedAt = emailDetail.CreatedAt,
            Attachments = attachments
        };

        _logger.LogInformation("Retrieved email details for ID: {EmailId}", id);
        return emailDto;
    }

    public async Task<EmailAttachment?> GetAttachmentByIdAsync(Guid attachmentId,
        CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching attachment with ID: {AttachmentId}", attachmentId);

        var attachment = await _context.EmailAttachments
            .FirstOrDefaultAsync(a => a.Id == attachmentId, cancellationToken);

        if (attachment == null) _logger.LogWarning("Attachment with ID {AttachmentId} not found", attachmentId);

        return attachment;
    }
}