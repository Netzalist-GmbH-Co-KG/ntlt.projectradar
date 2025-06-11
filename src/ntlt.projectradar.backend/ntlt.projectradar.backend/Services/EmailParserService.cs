using System.Text;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public class EmailParserService : IEmailParserService
{
    private readonly ProjectRadarContext _context;
    private readonly IGuidService _guidService;
    private readonly ILogger<EmailParserService> _logger;

    public EmailParserService(
        ProjectRadarContext context,
        IGuidService guidService,
        ILogger<EmailParserService> logger)
    {
        _context = context;
        _guidService = guidService;
        _logger = logger;
    }

    public async Task<EmailDetails> ParseAndPersistEmailAsync(RawLead rawLead,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Starting email parsing for RawLead {RawLeadId}", rawLead.Id);

        try
        {
            // Parse email content using MimeKit
            var message = await ParseEmailContentAsync(rawLead.OriginalContent);

            // Handle deduplication - delete existing EmailDetails and attachments for this RawLead
            await DeleteExistingEmailDataAsync(rawLead.Id, cancellationToken);

            // Create new EmailDetails
            var emailDetails = await CreateEmailDetailsAsync(rawLead.Id, message, cancellationToken);

            // Extract and persist attachments
            await ExtractAndPersistAttachmentsAsync(emailDetails.Id, message, cancellationToken);

            _logger.LogInformation("Successfully parsed and persisted email for RawLead {RawLeadId}", rawLead.Id);
            return emailDetails;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing email for RawLead {RawLeadId}", rawLead.Id);
            throw;
        }
    }

    private async Task<MimeMessage> ParseEmailContentAsync(string emlContent)
    {
        try
        {
            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(emlContent));
            var message = await MimeMessage.LoadAsync(stream);
            return message;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse email content with MimeKit");
            throw new InvalidOperationException("Failed to parse email content", ex);
        }
    }

    private async Task DeleteExistingEmailDataAsync(Guid rawLeadId, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Checking for existing EmailDetails for RawLead {RawLeadId}", rawLeadId);

        var existingEmailDetails = await _context.EmailDetails
            .FirstOrDefaultAsync(ed => ed.RawLeadId == rawLeadId, cancellationToken);

        if (existingEmailDetails != null)
        {
            _logger.LogInformation("Deleting existing EmailDetails {EmailDetailsId} for RawLead {RawLeadId}",
                existingEmailDetails.Id, rawLeadId);

            // Delete existing attachments first
            var existingAttachments = await _context.EmailAttachments
                .Where(ea => ea.EmailDetailsId == existingEmailDetails.Id)
                .ToListAsync(cancellationToken);

            if (existingAttachments.Any())
            {
                _logger.LogDebug("Deleting {AttachmentCount} existing attachments", existingAttachments.Count);
                _context.EmailAttachments.RemoveRange(existingAttachments);
            }

            // Delete EmailDetails
            _context.EmailDetails.Remove(existingEmailDetails);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task<EmailDetails> CreateEmailDetailsAsync(Guid rawLeadId, MimeMessage message,
        CancellationToken cancellationToken)
    {
        var emailDetails = new EmailDetails
        {
            Id = _guidService.NewGuid(),
            RawLeadId = rawLeadId,
            EmailFrom = message.From?.ToString() ?? string.Empty,
            EmailTo = message.To?.ToString() ?? string.Empty,
            EmailSubject = message.Subject ?? string.Empty,
            EmailDate = message.Date.DateTime != DateTime.MinValue ? message.Date.DateTime : null,
            EmailBodyText = ExtractTextBody(message),
            EmailBodyHtml = ExtractHtmlBody(message),
            CreatedAt = DateTime.UtcNow
        };

        _context.EmailDetails.Add(emailDetails);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogDebug("Created EmailDetails {EmailDetailsId} for RawLead {RawLeadId}",
            emailDetails.Id, rawLeadId);

        return emailDetails;
    }

    private string ExtractTextBody(MimeMessage message)
    {
        try
        {
            return message.TextBody ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to extract text body from email");
            return string.Empty;
        }
    }

    private string ExtractHtmlBody(MimeMessage message)
    {
        try
        {
            return message.HtmlBody ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to extract HTML body from email");
            return string.Empty;
        }
    }

    private async Task ExtractAndPersistAttachmentsAsync(Guid emailDetailsId, MimeMessage message,
        CancellationToken cancellationToken)
    {
        var attachments = new List<EmailAttachment>();

        foreach (var attachment in message.Attachments)
            try
            {
                var emailAttachment = new EmailAttachment
                {
                    Id = _guidService.NewGuid(),
                    EmailDetailsId = emailDetailsId,
                    AttachmentFilename = attachment.ContentDisposition?.FileName ?? "unknown",
                    AttachmentMimeType = attachment.ContentType?.MimeType ?? "application/octet-stream",
                    AttachmentContent = await ExtractAttachmentContentAsync(attachment),
                    CreatedAt = DateTime.UtcNow
                };

                attachments.Add(emailAttachment);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to extract attachment {FileName} for EmailDetails {EmailDetailsId}",
                    attachment.ContentDisposition?.FileName, emailDetailsId);
            }

        if (attachments.Any())
        {
            _context.EmailAttachments.AddRange(attachments);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogDebug("Persisted {AttachmentCount} attachments for EmailDetails {EmailDetailsId}",
                attachments.Count, emailDetailsId);
        }
    }

    private async Task<string> ExtractAttachmentContentAsync(MimeEntity attachment)
    {
        try
        {
            if (attachment is MimePart part)
            {
                using var memory = new MemoryStream();
                await part.Content.DecodeToAsync(memory);
                return Convert.ToBase64String(memory.ToArray());
            }

            return string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to extract attachment content");
            return string.Empty;
        }
    }
}