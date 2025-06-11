namespace ntlt.projectradar.backend.DTOs;

public class ProjectDetailsDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ClientName { get; set; }
    public string? AgencyName { get; set; }
    public string? ContactEmail { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public string? Timeline { get; set; }
    public List<string> Technologies { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateProjectDetailsDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ClientName { get; set; }
    public string? AgencyName { get; set; }
    public string? ContactEmail { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public string? Timeline { get; set; }
    public List<string> Technologies { get; set; } = new();
}

public class UpdateProjectDetailsDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ClientName { get; set; }
    public string? AgencyName { get; set; }
    public string? ContactEmail { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public string? Timeline { get; set; }
    public List<string> Technologies { get; set; } = new();
}

public class ProjectEmailLinkDto
{
    public Guid ProjectId { get; set; }
    public Guid EmailId { get; set; }
}