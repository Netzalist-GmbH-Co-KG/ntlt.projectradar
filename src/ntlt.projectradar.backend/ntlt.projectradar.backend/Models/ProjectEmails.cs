using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class ProjectEmails
{
    [Key] public Guid Id { get; set; }
    [Key] public Guid ProjectId { get; set; }
    [Key] public Guid EmailId { get; set; }
}