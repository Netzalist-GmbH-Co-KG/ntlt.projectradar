using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public interface IRawLeadService
{
    /// <summary>
    /// Creates a new RawLead from uploaded .eml file content
    /// </summary>
    /// <param name="emlContent">The content of the .eml file</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The created RawLead with generated ID</returns>
    Task<RawLead> CreateRawLeadAsync(string emlContent, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a RawLead by its ID
    /// </summary>
    /// <param name="id">The RawLead ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The RawLead or null if not found</returns>
    Task<RawLead?> GetRawLeadByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all RawLeads with optional filtering
    /// </summary>
    /// <param name="status">Optional status filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of RawLeads</returns>
    Task<List<RawLead>> GetRawLeadsAsync(ProcessingStatus? status = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates the processing status of a RawLead
    /// </summary>
    /// <param name="id">The RawLead ID</param>
    /// <param name="status">New processing status</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if updated successfully, false if not found</returns>
    Task<bool> UpdateProcessingStatusAsync(Guid id, ProcessingStatus status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a RawLead
    /// </summary>
    /// <param name="id">The RawLead ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully, false if not found</returns>
    Task<bool> DeleteRawLeadAsync(Guid id, CancellationToken cancellationToken = default);
}
