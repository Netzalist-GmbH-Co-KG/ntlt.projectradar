using Microsoft.AspNetCore.Mvc;
using ntlt.projectradar.backend.DTOs;
using ntlt.projectradar.backend.Services;

namespace ntlt.projectradar.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailsController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailsController> _logger;

    public EmailsController(IEmailService emailService, ILogger<EmailsController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated list of emails ordered by date descending
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Number of emails per page (default: 100, max: 100)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated email list</returns>
    [HttpGet]
    public async Task<ActionResult<EmailListResponseDto>> GetEmails(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 100, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("GET /api/emails called with page={Page}, pageSize={PageSize}", page, pageSize);

            var result = await _emailService.GetEmailsAsync(page, pageSize, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving emails list");
            return StatusCode(500, "An error occurred while retrieving emails");
        }
    }

    /// <summary>
    /// Get detailed information for a specific email
    /// </summary>
    /// <param name="id">Email ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Email details</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EmailDetailsDto>> GetEmailById(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("GET /api/emails/{EmailId} called", id);

            var email = await _emailService.GetEmailByIdAsync(id, cancellationToken);
            
            if (email == null)
            {
                _logger.LogWarning("Email with ID {EmailId} not found", id);
                return NotFound($"Email with ID {id} not found");
            }

            return Ok(email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving email with ID {EmailId}", id);
            return StatusCode(500, "An error occurred while retrieving the email");
        }
    }

    /// <summary>
    /// Download an email attachment
    /// </summary>
    /// <param name="attachmentId">Attachment ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Attachment file</returns>
    [HttpGet("attachments/{attachmentId:guid}")]
    public async Task<IActionResult> GetAttachment(Guid attachmentId, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("GET /api/emails/attachments/{AttachmentId} called", attachmentId);

            var attachment = await _emailService.GetAttachmentByIdAsync(attachmentId, cancellationToken);
            
            if (attachment == null)
            {
                _logger.LogWarning("Attachment with ID {AttachmentId} not found", attachmentId);
                return NotFound($"Attachment with ID {attachmentId} not found");
            }            return File(
                attachment.AttachmentContent, 
                attachment.AttachmentMimeType, 
                attachment.AttachmentFilename);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving attachment with ID {AttachmentId}", attachmentId);
            return StatusCode(500, "An error occurred while retrieving the attachment");
        }
    }
}
