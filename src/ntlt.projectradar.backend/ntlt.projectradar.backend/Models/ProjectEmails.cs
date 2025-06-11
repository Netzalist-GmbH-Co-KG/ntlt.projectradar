using System.ComponentModel.DataAnnotations;

namespace ntlt.projectradar.backend.Models;

public class ProjectEmails
{
    public Guid ProjectId { get; set; }
    public Guid EmailId { get; set; }
}