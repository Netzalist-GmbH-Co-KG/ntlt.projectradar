using Microsoft.EntityFrameworkCore;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public class ProjectStatusService : IProjectStatusService
{
    private readonly ProjectRadarContext _context;
    private readonly ILogger<ProjectStatusService> _logger;

    public ProjectStatusService(ProjectRadarContext context, ILogger<ProjectStatusService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> IsValidStatusTransitionAsync(ProjectStatus currentStatus, ProjectStatus newStatus)
    {
        if (currentStatus == newStatus) return true; // No change is always valid

        // Allow direct to NotInteresting or MissedOpportunity from any 'Interesting' state or 'New'
        if (newStatus == ProjectStatus.NotInteresting || newStatus == ProjectStatus.MissedOpportunity)
        {
            return currentStatus == ProjectStatus.New ||
                   currentStatus == ProjectStatus.InterestingCold ||
                   currentStatus == ProjectStatus.InterestingContacted ||
                   currentStatus == ProjectStatus.InterestingInProgress;
        }

        // Allow from NotInteresting or MissedOpportunity back to an 'Interesting' state or 'New'
        if (currentStatus == ProjectStatus.NotInteresting || currentStatus == ProjectStatus.MissedOpportunity)
        {
            return newStatus == ProjectStatus.New ||
                   newStatus == ProjectStatus.InterestingCold ||
                   newStatus == ProjectStatus.InterestingContacted ||
                   newStatus == ProjectStatus.InterestingInProgress;
        }
        
        // Sequential "Interesting" flow
        var sequentialPath = new List<ProjectStatus>
        {
            ProjectStatus.New,
            ProjectStatus.InterestingCold,
            ProjectStatus.InterestingContacted,
            ProjectStatus.InterestingInProgress
        };

        int currentIndex = sequentialPath.IndexOf(currentStatus);
        int newIndex = sequentialPath.IndexOf(newStatus);

        if (currentIndex != -1 && newIndex != -1)
        {
            // Allow one step forward or backward
            if (Math.Abs(currentIndex - newIndex) == 1)
            {
                return true;
            }
        }
        
        // From InterestingInProgress to Won or Lost
        if (currentStatus == ProjectStatus.InterestingInProgress && (newStatus == ProjectStatus.Won || newStatus == ProjectStatus.Lost))
        {
            return true;
        }

        // From Won/Lost back to InterestingInProgress (e.g. correction)
        if ((currentStatus == ProjectStatus.Won || currentStatus == ProjectStatus.Lost) && newStatus == ProjectStatus.InterestingInProgress)
        {
            return true;
        }

        _logger.LogWarning($"Invalid status transition attempted from {currentStatus} to {newStatus}.");
        return await Task.FromResult(false);
    }

    public async Task<bool> UpdateProjectStatusAsync(Guid projectId, ProjectStatus newStatus, string? comment, string changedBy)
    {
        var project = await _context.ProjectDetails.FindAsync(projectId);
        if (project == null)
        {
            _logger.LogWarning($"Project with ID {projectId} not found for status update.");
            return false;
        }

        if (!await IsValidStatusTransitionAsync(project.CurrentStatus, newStatus))
        {
            _logger.LogWarning($"Invalid status transition for project {projectId} from {project.CurrentStatus} to {newStatus}.");
            return false;
        }

        // Validate comment for specific statuses
        if ((newStatus == ProjectStatus.Lost || newStatus == ProjectStatus.NotInteresting || newStatus == ProjectStatus.MissedOpportunity) && string.IsNullOrWhiteSpace(comment))
        {
            _logger.LogWarning($"Comment is required for status {newStatus} on project {projectId}.");
            return false; // Or throw a specific validation exception
        }

        var oldStatus = project.CurrentStatus;
        project.CurrentStatus = newStatus;

        var historyEntry = new ProjectStatusHistory
        {
            ProjectId = projectId,
            Status = newStatus,
            Timestamp = DateTime.UtcNow,
            Comment = comment,
            ChangedBy = changedBy
        };
        _context.ProjectStatusHistories.Add(historyEntry);

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Project {projectId} status updated from {oldStatus} to {newStatus} by {changedBy}.");
            return true;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, $"Error updating project status for {projectId}.");
            // Revert status change if save fails to maintain consistency, though EF Core might handle this with change tracking.
            project.CurrentStatus = oldStatus; 
            return false;
        }
    }
    
    public async Task SetInitialProjectStatusAsync(Guid projectId, string? initialComment = "Automatisch generiert", string changedBy = "System")
    {
        var project = await _context.ProjectDetails.FindAsync(projectId);
        if (project == null)
        {
            _logger.LogWarning($"Project with ID {projectId} not found for setting initial status.");
            // Consider throwing an exception if project must exist
            return;
        }

        // This assumes new projects don't have a status set yet, or it's okay to overwrite.
        // If ProjectDetails.CurrentStatus is not nullable and has a default, this might be redundant
        // or need adjustment based on how CurrentStatus is initialized.
        // For now, we explicitly set it to New as per requirements.
        project.CurrentStatus = ProjectStatus.New;

        var historyEntry = new ProjectStatusHistory
        {
            ProjectId = projectId,
            Status = ProjectStatus.New,
            Timestamp = DateTime.UtcNow,
            Comment = initialComment,
            ChangedBy = changedBy
        };
        _context.ProjectStatusHistories.Add(historyEntry);
        
        // We also need to update the project itself if CurrentStatus was not already New
        _context.ProjectDetails.Update(project);

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Initial status 'New' set for project {projectId} by {changedBy}.");
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, $"Error setting initial project status for {projectId}.");
            // Potentially revert changes if necessary, though complex with new entities.
        }
    }
}
