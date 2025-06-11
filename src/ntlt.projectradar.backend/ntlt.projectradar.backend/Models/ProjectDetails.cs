using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class ProjectDetails
{
    [Key] public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public string Timeline { get; set; } = string.Empty;
    public List<string> Technologies { get; set; } = new List<string>();
    public double Confidence { get; set; }
    [Required] public DateTime CreatedAt { get; set; }
}