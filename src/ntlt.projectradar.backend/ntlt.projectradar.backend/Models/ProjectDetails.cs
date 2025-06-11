using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class ProjectDetails
{
    [Key] public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ClientName { get; set; }
    public string? AgencyName { get; set; }
    public string? ContactEmail { get; set; } 
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public string? Timeline { get; set; }
    public List<string> Technologies { get; set; } = new();
    [Required] public DateTime CreatedAt { get; set; }
}