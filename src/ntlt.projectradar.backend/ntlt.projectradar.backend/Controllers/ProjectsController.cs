using Microsoft.AspNetCore.Mvc;
using ntlt.projectradar.backend.DTOs;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;

namespace ntlt.projectradar.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ILogger<ProjectsController> _logger;
    private readonly IProjectDetailsService _projectDetailsService;

    public ProjectsController(
        IProjectDetailsService projectDetailsService,
        ILogger<ProjectsController> logger)
    {
        _projectDetailsService = projectDetailsService;
        _logger = logger;
    }

    /// <summary>
    ///     Get all projects
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<ProjectDetailsDto>>> GetProjects(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Fetching all projects");

            var projects = await _projectDetailsService.GetProjectDetailsAsync(cancellationToken);
            var projectDtos = projects.Select(MapToDto).ToList();

            return Ok(projectDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching projects");
            return StatusCode(500, "An error occurred while fetching projects");
        }
    }

    /// <summary>
    ///     Get project by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProjectDetailsDto>> GetProject(Guid id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Fetching project with ID: {ProjectId}", id);

            var project = await _projectDetailsService.GetProjectDetailsByIdAsync(id, cancellationToken);

            if (project == null) return NotFound($"Project with ID {id} not found");

            return Ok(MapToDto(project));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching project {ProjectId}", id);
            return StatusCode(500, "An error occurred while fetching the project");
        }
    }

    /// <summary>
    ///     Create a new project
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ProjectDetailsDto>> CreateProject(
        [FromBody] CreateProjectDetailsDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Creating new project with title: {Title}", createDto.Title);

            var project = MapFromCreateDto(createDto);
            var createdProject = await _projectDetailsService.CreateProjectDetailsAsync(project, cancellationToken);

            var projectDto = MapToDto(createdProject);
            return CreatedAtAction(nameof(GetProject), new { id = createdProject.Id }, projectDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating project");
            return StatusCode(500, "An error occurred while creating the project");
        }
    }

    /// <summary>
    ///     Update an existing project
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProjectDetailsDto>> UpdateProject(
        Guid id,
        [FromBody] UpdateProjectDetailsDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Updating project with ID: {ProjectId}", id);

            var project = MapFromUpdateDto(id, updateDto);
            var updatedProject = await _projectDetailsService.UpdateProjectDetailsAsync(project, cancellationToken);

            if (updatedProject == null) return NotFound($"Project with ID {id} not found");

            return Ok(MapToDto(updatedProject));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating project {ProjectId}", id);
            return StatusCode(500, "An error occurred while updating the project");
        }
    }

    /// <summary>
    ///     Delete a project
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteProject(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Deleting project with ID: {ProjectId}", id);

            var deleted = await _projectDetailsService.DeleteProjectDetailsAsync(id, cancellationToken);

            if (!deleted) return NotFound($"Project with ID {id} not found");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting project {ProjectId}", id);
            return StatusCode(500, "An error occurred while deleting the project");
        }
    }

    /// <summary>
    ///     Get projects linked to a specific email
    /// </summary>
    [HttpGet("by-email/{emailId:guid}")]
    public async Task<ActionResult<List<ProjectDetailsDto>>> GetProjectsByEmail(
        Guid emailId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Fetching projects linked to email: {EmailId}", emailId);

            var projects = await _projectDetailsService.GetProjectDetailsByEmailIdAsync(emailId, cancellationToken);
            var projectDtos = projects.Select(MapToDto).ToList();

            return Ok(projectDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching projects for email {EmailId}", emailId);
            return StatusCode(500, "An error occurred while fetching projects for the email");
        }
    }

    /// <summary>
    ///     Link a project to an email
    /// </summary>
    [HttpPost("link-email")]
    public async Task<ActionResult> LinkProjectToEmail(
        [FromBody] ProjectEmailLinkDto linkDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Linking project {ProjectId} to email {EmailId}", linkDto.ProjectId,
                linkDto.EmailId);

            var linked = await _projectDetailsService.LinkProjectToEmailAsync(
                linkDto.ProjectId,
                linkDto.EmailId,
                cancellationToken);

            if (!linked) return BadRequest("Failed to link project to email. Ensure both project and email exist.");

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while linking project {ProjectId} to email {EmailId}",
                linkDto.ProjectId, linkDto.EmailId);
            return StatusCode(500, "An error occurred while linking the project to email");
        }
    }

    /// <summary>
    ///     Unlink a project from an email
    /// </summary>
    [HttpDelete("unlink-email")]
    public async Task<ActionResult> UnlinkProjectFromEmail(
        [FromBody] ProjectEmailLinkDto linkDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Unlinking project {ProjectId} from email {EmailId}", linkDto.ProjectId,
                linkDto.EmailId);

            var unlinked = await _projectDetailsService.UnlinkProjectFromEmailAsync(
                linkDto.ProjectId,
                linkDto.EmailId,
                cancellationToken);

            if (!unlinked) return NotFound("No link found between the specified project and email");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while unlinking project {ProjectId} from email {EmailId}",
                linkDto.ProjectId, linkDto.EmailId);
            return StatusCode(500, "An error occurred while unlinking the project from email");
        }
    }

    /// <summary>
    ///     Extract project details from an email and create a new project
    /// </summary>
    [HttpPost("extract-from-email/{emailId:guid}")]
    public async Task<ActionResult<ProjectDetailsDto>> ExtractAndCreateFromEmail(
        Guid emailId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Extracting and creating project from email: {EmailId}", emailId);

            var extractedProject =
                await _projectDetailsService.ExtractAndCreateFromEmailAsync(emailId, cancellationToken);

            if (extractedProject == null)
                return BadRequest(
                    "Failed to extract project details from email. Email may not exist or contain insufficient project information.");

            var projectDto = MapToDto(extractedProject);
            return CreatedAtAction(nameof(GetProject), new { id = extractedProject.Id }, projectDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while extracting and creating project from email {EmailId}", emailId);
            return StatusCode(500, "An error occurred while extracting and creating project from email");
        }
    }

    #region Private Mapping Methods

    private static ProjectDetailsDto MapToDto(ProjectDetails project)
    {
        return new ProjectDetailsDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            ClientName = project.ClientName,
            AgencyName = project.AgencyName,
            ContactEmail = project.ContactEmail,
            BudgetMin = project.BudgetMin,
            BudgetMax = project.BudgetMax,
            Timeline = project.Timeline,
            Technologies = project.Technologies,
            CreatedAt = project.CreatedAt
        };
    }

    private static ProjectDetails MapFromCreateDto(CreateProjectDetailsDto createDto)
    {
        return new ProjectDetails
        {
            Title = createDto.Title,
            Description = createDto.Description,
            ClientName = createDto.ClientName,
            AgencyName = createDto.AgencyName,
            ContactEmail = createDto.ContactEmail,
            BudgetMin = createDto.BudgetMin,
            BudgetMax = createDto.BudgetMax,
            Timeline = createDto.Timeline,
            Technologies = createDto.Technologies
        };
    }

    private static ProjectDetails MapFromUpdateDto(Guid id, UpdateProjectDetailsDto updateDto)
    {
        return new ProjectDetails
        {
            Id = id,
            Title = updateDto.Title,
            Description = updateDto.Description,
            ClientName = updateDto.ClientName,
            AgencyName = updateDto.AgencyName,
            ContactEmail = updateDto.ContactEmail,
            BudgetMin = updateDto.BudgetMin,
            BudgetMax = updateDto.BudgetMax,
            Timeline = updateDto.Timeline,
            Technologies = updateDto.Technologies
        };
    }

    #endregion
}