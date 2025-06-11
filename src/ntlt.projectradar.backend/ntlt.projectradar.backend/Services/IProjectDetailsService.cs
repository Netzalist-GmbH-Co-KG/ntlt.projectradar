using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public interface IProjectDetailsService
{
    Task<ProjectDetails> CreateProjectDetailsAsync(ProjectDetails projectDetails,
        CancellationToken cancellationToken = default);

    Task<ProjectDetails?> GetProjectDetailsByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<ProjectDetails>> GetProjectDetailsAsync(CancellationToken cancellationToken = default);

    Task<ProjectDetails?> UpdateProjectDetailsAsync(ProjectDetails projectDetails,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteProjectDetailsAsync(Guid id, CancellationToken cancellationToken = default);

    Task<List<ProjectDetails>> GetProjectDetailsByEmailIdAsync(Guid emailId,
        CancellationToken cancellationToken = default);

    Task<bool> LinkProjectToEmailAsync(Guid projectId, Guid emailId, CancellationToken cancellationToken = default);
    Task<bool> UnlinkProjectFromEmailAsync(Guid projectId, Guid emailId, CancellationToken cancellationToken = default);
    Task<ProjectDetails?> ExtractAndCreateFromEmailAsync(Guid emailId, CancellationToken cancellationToken = default);
}