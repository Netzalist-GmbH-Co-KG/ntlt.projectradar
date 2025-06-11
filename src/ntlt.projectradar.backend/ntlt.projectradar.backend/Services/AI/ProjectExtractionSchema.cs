namespace ntlt.projectradar.backend.Services.AI;

/// <summary>
/// Schema for OpenAI Function Calling to extract project data from email content
/// </summary>
public class ProjectExtractionSchema
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ClientName { get; set; }
    public string? AgencyName { get; set; }
    public string? ContactEmail { get; set; }
    public string? ProjectType { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public string? Timeline { get; set; }
    public string[]? Technologies { get; set; }
    public string? Location { get; set; }
    public bool? RemotePossible { get; set; }
    public string? SourceType { get; set; }
}
