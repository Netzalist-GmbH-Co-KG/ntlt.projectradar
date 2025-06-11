using Microsoft.EntityFrameworkCore;
using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services.AI;

namespace ntlt.projectradar.backend.Services;

public class ProjectDetailsService : IProjectDetailsService
{
    private readonly ProjectRadarContext _context;
    private readonly IGuidService _guidService;
    private readonly ILogger<ProjectDetailsService> _logger;
    private readonly IDataExtractor _dataExtractor;

    public ProjectDetailsService(
        ProjectRadarContext context,
        IGuidService guidService,
        ILogger<ProjectDetailsService> logger,
        IDataExtractor dataExtractor)
    {
        _context = context;
        _guidService = guidService;
        _logger = logger;
        _dataExtractor = dataExtractor;
    }

    public async Task<ProjectDetails> CreateProjectDetailsAsync(ProjectDetails projectDetails, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new ProjectDetails with title: {Title}", projectDetails.Title);

        // Ensure ID and CreatedAt are set
        if (projectDetails.Id == Guid.Empty)
        {
            projectDetails.Id = _guidService.NewGuid();
        }
        
        if (projectDetails.CreatedAt == default)
        {
            projectDetails.CreatedAt = DateTime.UtcNow;
        }

        _context.ProjectDetails.Add(projectDetails);
        await _context.SaveChangesAsync(cancellationToken);
        
        _logger.LogInformation("ProjectDetails created successfully with ID: {ProjectId}", projectDetails.Id);
        return projectDetails;
    }

    public async Task<ProjectDetails?> GetProjectDetailsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching ProjectDetails with ID: {ProjectId}", id);

        var projectDetails = await _context.ProjectDetails
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (projectDetails == null) 
        {
            _logger.LogWarning("ProjectDetails with ID {ProjectId} not found", id);
        }

        return projectDetails;
    }

    public async Task<List<ProjectDetails>> GetProjectDetailsAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching all ProjectDetails");

        var projectDetails = await _context.ProjectDetails
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Retrieved {Count} ProjectDetails", projectDetails.Count);
        return projectDetails;
    }

    public async Task<ProjectDetails?> UpdateProjectDetailsAsync(ProjectDetails projectDetails, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating ProjectDetails with ID: {ProjectId}", projectDetails.Id);

        var existingProject = await _context.ProjectDetails
            .FirstOrDefaultAsync(p => p.Id == projectDetails.Id, cancellationToken);

        if (existingProject == null)
        {
            _logger.LogWarning("ProjectDetails with ID {ProjectId} not found for update", projectDetails.Id);
            return null;
        }

        // Update properties
        existingProject.Title = projectDetails.Title;
        existingProject.Description = projectDetails.Description;
        existingProject.ClientName = projectDetails.ClientName;
        existingProject.AgencyName = projectDetails.AgencyName;
        existingProject.ContactEmail = projectDetails.ContactEmail;
        existingProject.BudgetMin = projectDetails.BudgetMin;
        existingProject.BudgetMax = projectDetails.BudgetMax;
        existingProject.Timeline = projectDetails.Timeline;
        existingProject.Technologies = projectDetails.Technologies;

        await _context.SaveChangesAsync(cancellationToken);
        
        _logger.LogInformation("ProjectDetails {ProjectId} updated successfully", projectDetails.Id);
        return existingProject;
    }

    public async Task<bool> DeleteProjectDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting ProjectDetails with ID: {ProjectId}", id);

        var projectDetails = await _context.ProjectDetails
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (projectDetails == null)
        {
            _logger.LogWarning("ProjectDetails with ID {ProjectId} not found for deletion", id);
            return false;
        }

        // Remove associated ProjectEmails relationships first
        var projectEmails = await _context.ProjectEmails
            .Where(pe => pe.ProjectId == id)
            .ToListAsync(cancellationToken);
        
        _context.ProjectEmails.RemoveRange(projectEmails);
        _context.ProjectDetails.Remove(projectDetails);
        
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("ProjectDetails {ProjectId} deleted successfully", id);
        return true;
    }

    public async Task<List<ProjectDetails>> GetProjectDetailsByEmailIdAsync(Guid emailId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching ProjectDetails linked to EmailId: {EmailId}", emailId);

        var projectDetails = await _context.ProjectDetails
            .Where(p => _context.ProjectEmails
                .Any(pe => pe.EmailId == emailId && pe.ProjectId == p.Id))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Retrieved {Count} ProjectDetails for EmailId: {EmailId}", projectDetails.Count, emailId);
        return projectDetails;
    }

    public async Task<bool> LinkProjectToEmailAsync(Guid projectId, Guid emailId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Linking Project {ProjectId} to Email {EmailId}", projectId, emailId);

        // Check if link already exists
        var existingLink = await _context.ProjectEmails
            .FirstOrDefaultAsync(pe => pe.ProjectId == projectId && pe.EmailId == emailId, cancellationToken);

        if (existingLink != null)
        {
            _logger.LogInformation("Project {ProjectId} is already linked to Email {EmailId}", projectId, emailId);
            return true;
        }

        // Verify both entities exist
        var projectExists = await _context.ProjectDetails.AnyAsync(p => p.Id == projectId, cancellationToken);
        var emailExists = await _context.EmailDetails.AnyAsync(e => e.Id == emailId, cancellationToken);

        if (!projectExists)
        {
            _logger.LogWarning("Project {ProjectId} not found for linking", projectId);
            return false;
        }

        if (!emailExists)
        {
            _logger.LogWarning("Email {EmailId} not found for linking", emailId);
            return false;
        }

        var projectEmail = new ProjectEmails
        {
            ProjectId = projectId,
            EmailId = emailId
        };

        _context.ProjectEmails.Add(projectEmail);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Project {ProjectId} successfully linked to Email {EmailId}", projectId, emailId);
        return true;
    }

    public async Task<bool> UnlinkProjectFromEmailAsync(Guid projectId, Guid emailId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Unlinking Project {ProjectId} from Email {EmailId}", projectId, emailId);

        var projectEmail = await _context.ProjectEmails
            .FirstOrDefaultAsync(pe => pe.ProjectId == projectId && pe.EmailId == emailId, cancellationToken);

        if (projectEmail == null)
        {
            _logger.LogWarning("No link found between Project {ProjectId} and Email {EmailId}", projectId, emailId);
            return false;
        }

        _context.ProjectEmails.Remove(projectEmail);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Project {ProjectId} successfully unlinked from Email {EmailId}", projectId, emailId);
        return true;
    }

    public async Task<ProjectDetails?> ExtractAndCreateFromEmailAsync(Guid emailId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Extracting ProjectDetails from Email {EmailId}", emailId);

        // Fetch the email content
        var email = await _context.EmailDetails
            .FirstOrDefaultAsync(e => e.Id == emailId, cancellationToken);

        if (email == null)
        {
            _logger.LogWarning("Email with ID {EmailId} not found for extraction", emailId);
            return null;
        }

        // Use the AI service to extract project details from the email content
        var projectDetails = await _dataExtractor.Extract(email.EmailBodyText, cancellationToken);

        if (projectDetails == null)
        {
            _logger.LogError("Failed to extract project details from Email {EmailId}", emailId);
            return null;
        }

        // Set the extracted details
        projectDetails.ContactEmail ??= email.EmailFrom;
        projectDetails.CreatedAt = DateTime.UtcNow;

        // Create the project details in the database
        var newProject = await CreateProjectDetailsAsync(projectDetails, cancellationToken);

        // Link to EmailDetails
        var projectEmail = new ProjectEmails
        {
            ProjectId = newProject.Id,
            EmailId = emailId
        };
        _context.ProjectEmails.Add(projectEmail);
        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("ProjectDetails created from Email {EmailId} with ID: {ProjectId}", emailId, newProject.Id);
        return newProject;
    }
}
