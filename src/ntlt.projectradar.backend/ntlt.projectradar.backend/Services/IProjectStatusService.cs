using ntlt.projectradar.backend.Models;
using System;
using System.Threading.Tasks;

namespace ntlt.projectradar.backend.Services;

public interface IProjectStatusService
{
    /// <summary>
    /// Validates if a transition from the current status to a new status is allowed.
    /// </summary>
    /// <param name="currentStatus">The current status of the project.</param>
    /// <param name="newStatus">The desired new status for the project.</param>
    /// <returns>True if the transition is valid, otherwise false.</returns>
    Task<bool> IsValidStatusTransitionAsync(ProjectStatus currentStatus, ProjectStatus newStatus);

    /// <summary>
    /// Updates the status of a project, creates a history entry, and saves changes.
    /// </summary>
    /// <param name="projectId">The ID of the project to update.</param>
    /// <param name="newStatus">The new status for the project.</param>
    /// <param name="comment">An optional comment for the status change.</param>
    /// <param name="changedBy">The identifier of the user or system making the change.</param>
    /// <returns>True if the update was successful, false if the transition was invalid or project not found.</returns>
    Task<bool> UpdateProjectStatusAsync(Guid projectId, ProjectStatus newStatus, string? comment, string changedBy);

    /// <summary>
    /// Sets the initial status of a newly created project to 'New' and creates a history entry.
    /// </summary>
    /// <param name="projectId">The ID of the newly created project.</param>
    /// <param name="initialComment">Optional comment for the initial status. Defaults to "Automatisch generiert".</param>
    /// <param name="changedBy">Identifier for who set the initial status. Defaults to "System".</param>
    /// <returns>Task representing the asynchronous operation.</returns>
    Task SetInitialProjectStatusAsync(Guid projectId, string? initialComment = "Automatisch generiert", string changedBy = "System");
}
