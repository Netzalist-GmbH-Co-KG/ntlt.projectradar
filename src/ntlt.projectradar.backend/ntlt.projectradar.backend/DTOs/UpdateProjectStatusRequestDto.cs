using ntlt.projectradar.backend.Models;
using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.DTOs;

public class UpdateProjectStatusRequestDto
{
    [Required]
    public ProjectStatus NewStatus { get; set; }
    public string? Comment { get; set; }
}
