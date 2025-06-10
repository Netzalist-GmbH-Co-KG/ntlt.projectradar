using Microsoft.AspNetCore.Mvc;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;

namespace ntlt.projectradar.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RawLeadsController : ControllerBase
{
    private readonly IRawLeadService _rawLeadService;
    private readonly ILogger<RawLeadsController> _logger;

    public RawLeadsController(IRawLeadService rawLeadService, ILogger<RawLeadsController> logger)
    {
        _rawLeadService = rawLeadService;
        _logger = logger;
    }

    /// <summary>
    /// Upload a .eml file and create a new RawLead
    /// </summary>
    /// <param name="file">The .eml file to upload</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created RawLead</returns>
    [HttpPost("upload")]
    public async Task<ActionResult<RawLead>> UploadEmlFile(
        IFormFile file, 
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Received file upload request: {FileName} ({FileSize} bytes)", 
            file?.FileName, file?.Length);

        // Validate file is provided
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("No file provided in upload request");
            return BadRequest(new { error = "No file provided" });
        }

        // Validate file extension
        if (!Path.GetExtension(file.FileName).Equals(".eml", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Invalid file extension: {FileName}", file.FileName);
            return BadRequest(new { error = "Only .eml files are allowed" });
        }

        // Validate file size (max 10MB)
        const long maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.Length > maxFileSize)
        {
            _logger.LogWarning("File too large: {FileSize} bytes (max: {MaxFileSize})", 
                file.Length, maxFileSize);
            return BadRequest(new { error = "File size exceeds 10MB limit" });
        }

        try
        {
            // Read file content
            string emlContent;
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                emlContent = await reader.ReadToEndAsync(cancellationToken);
            }

            // Validate EML content (basic check for email headers)
            if (string.IsNullOrWhiteSpace(emlContent) || 
                (!emlContent.Contains("From:") && !emlContent.Contains("Subject:")))
            {
                _logger.LogWarning("Invalid EML content - missing email headers");
                return BadRequest(new { error = "Invalid .eml file - missing email headers" });
            }

            // Create RawLead through service
            var rawLead = await _rawLeadService.CreateRawLeadAsync(emlContent, cancellationToken);

            _logger.LogInformation("Successfully created RawLead {RawLeadId} from file {FileName}", 
                rawLead.Id, file.FileName);

            return CreatedAtAction(
                nameof(GetRawLead), 
                new { id = rawLead.Id }, 
                rawLead);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing .eml file upload: {FileName}", file.FileName);
            return StatusCode(500, new { error = "Internal server error while processing file" });
        }
    }

    /// <summary>
    /// Get a specific RawLead by ID
    /// </summary>
    /// <param name="id">RawLead ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>RawLead if found</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RawLead>> GetRawLead(
        Guid id, 
        CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting RawLead with ID: {RawLeadId}", id);

        var rawLead = await _rawLeadService.GetRawLeadByIdAsync(id, cancellationToken);
        
        if (rawLead == null)
        {
            _logger.LogWarning("RawLead with ID {RawLeadId} not found", id);
            return NotFound(new { error = $"RawLead with ID {id} not found" });
        }

        return Ok(rawLead);
    }

    /// <summary>
    /// Get all RawLeads with optional status filter
    /// </summary>
    /// <param name="status">Optional status filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of RawLeads</returns>
    [HttpGet]
    public async Task<ActionResult<List<RawLead>>> GetRawLeads(
        [FromQuery] ProcessingStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting RawLeads with status filter: {Status}", status?.ToString() ?? "All");

        var rawLeads = await _rawLeadService.GetRawLeadsAsync(status, cancellationToken);
        
        return Ok(rawLeads);
    }

    /// <summary>
    /// Update the processing status of a RawLead
    /// </summary>
    /// <param name="id">RawLead ID</param>
    /// <param name="request">Status update request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult> UpdateProcessingStatus(
        Guid id,
        [FromBody] UpdateStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating RawLead {RawLeadId} status to {Status}", id, request.Status);

        var success = await _rawLeadService.UpdateProcessingStatusAsync(id, request.Status, cancellationToken);
        
        if (!success)
        {
            _logger.LogWarning("Failed to update RawLead {RawLeadId} - not found", id);
            return NotFound(new { error = $"RawLead with ID {id} not found" });
        }

        return NoContent();
    }

    /// <summary>
    /// Delete a RawLead
    /// </summary>
    /// <param name="id">RawLead ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteRawLead(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting RawLead with ID: {RawLeadId}", id);

        var success = await _rawLeadService.DeleteRawLeadAsync(id, cancellationToken);
        
        if (!success)
        {
            _logger.LogWarning("Failed to delete RawLead {RawLeadId} - not found", id);
            return NotFound(new { error = $"RawLead with ID {id} not found" });
        }

        return NoContent();
    }
}

/// <summary>
/// Request model for updating processing status
/// </summary>
public class UpdateStatusRequest
{
    public ProcessingStatus Status { get; set; }
}
