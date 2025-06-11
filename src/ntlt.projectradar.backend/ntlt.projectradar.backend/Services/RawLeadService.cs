using Microsoft.EntityFrameworkCore;
using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public class RawLeadService : IRawLeadService
{
    private readonly ProjectRadarContext _context;
    private readonly IGuidService _guidService;
    private readonly ILogger<RawLeadService> _logger;

    public RawLeadService(ProjectRadarContext context, IGuidService guidService, ILogger<RawLeadService> logger)
    {
        _context = context;
        _guidService = guidService;
        _logger = logger;
    }

    public async Task<RawLead> CreateRawLeadAsync(string emlContent, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new RawLead from .eml content (length: {ContentLength})", emlContent.Length);

        var rawLead = new RawLead
        {
            Id = _guidService.NewGuid(),
            OriginalContent = emlContent,
            UploadedAt = DateTime.UtcNow,
            ProcessingStatus = ProcessingStatus.Processing
        };

        _context.RawLeads.Add(rawLead);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("RawLead created successfully with ID: {RawLeadId}", rawLead.Id);
        return rawLead;
    }

    public async Task<RawLead?> GetRawLeadByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching RawLead with ID: {RawLeadId}", id);

        var rawLead = await _context.RawLeads
            .FirstOrDefaultAsync(rl => rl.Id == id, cancellationToken);

        if (rawLead == null)
        {
            _logger.LogWarning("RawLead with ID {RawLeadId} not found", id);
        }

        return rawLead;
    }

    public async Task<List<RawLead>> GetRawLeadsAsync(ProcessingStatus? status = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching RawLeads with status filter: {Status}", status?.ToString() ?? "All");

        var query = _context.RawLeads.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(rl => rl.ProcessingStatus == status.Value);
        }

        var rawLeads = await query
            .OrderByDescending(rl => rl.UploadedAt)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Retrieved {Count} RawLeads", rawLeads.Count);
        return rawLeads;
    }

    public async Task<bool> UpdateProcessingStatusAsync(Guid id, ProcessingStatus status, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating RawLead {RawLeadId} status to {Status}", id, status);

        var rawLead = await _context.RawLeads
            .FirstOrDefaultAsync(rl => rl.Id == id, cancellationToken);

        if (rawLead == null)
        {
            _logger.LogWarning("RawLead with ID {RawLeadId} not found for status update", id);
            return false;
        }

        rawLead.ProcessingStatus = status;
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("RawLead {RawLeadId} status updated successfully to {Status}", id, status);
        return true;
    }

    public async Task<bool> DeleteRawLeadAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting RawLead with ID: {RawLeadId}", id);

        var rawLead = await _context.RawLeads
            .FirstOrDefaultAsync(rl => rl.Id == id, cancellationToken);

        if (rawLead == null)
        {
            _logger.LogWarning("RawLead with ID {RawLeadId} not found for deletion", id);
            return false;
        }

        _context.RawLeads.Remove(rawLead);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("RawLead {RawLeadId} deleted successfully", id);
        return true;
    }
}
