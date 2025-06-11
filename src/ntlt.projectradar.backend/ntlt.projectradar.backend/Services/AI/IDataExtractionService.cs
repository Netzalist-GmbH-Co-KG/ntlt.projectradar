using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services.AI;

public interface IDataExtractionService
{
    public Task<ProjectDetails?> Extract(string rawData, CancellationToken cancellationToken = default);
}