using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;
using ntlt.projectradar.backend.tests.TestHelper;
using NSubstitute;
using System;
using System.Linq;
using System.Threading.Tasks;
using NUnit.Framework;

namespace ntlt.projectradar.backend.tests.Services;

[TestFixture]
public class ProjectStatusServiceTests
{
    private ProjectRadarContext _context = null!;
    private ILogger<ProjectStatusService> _logger = null!;
    private ProjectStatusService _service = null!;
    private Guid _testProjectId;

    [SetUp]
    public async Task Setup()
    {
        var options = new DbContextOptionsBuilder<ProjectRadarContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique name for each test run
            .Options;

        _context = new ProjectRadarContext(options);
        _logger = Substitute.For<ILogger<ProjectStatusService>>();
        _service = new ProjectStatusService(_context, _logger);

        // Seed a test project
        _testProjectId = Guid.NewGuid();
        _context.ProjectDetails.Add(new ProjectDetails
        {
            Id = _testProjectId,
            Title = "Test Project for Status",
            CreatedAt = DateTime.UtcNow,
            CurrentStatus = ProjectStatus.New // Initial status
        });
        await _context.SaveChangesAsync();
        // Detach to ensure fresh load in tests if needed, though FindAsync should be fine.
        _context.ChangeTracker.Clear();
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    // Tests for IsValidStatusTransitionAsync
    [TestCase(ProjectStatus.New, ProjectStatus.InterestingCold, true)]
    [TestCase(ProjectStatus.InterestingCold, ProjectStatus.InterestingContacted, true)]
    [TestCase(ProjectStatus.InterestingContacted, ProjectStatus.InterestingInProgress, true)]
    [TestCase(ProjectStatus.InterestingInProgress, ProjectStatus.Won, true)]
    [TestCase(ProjectStatus.InterestingInProgress, ProjectStatus.Lost, true)]
    [TestCase(ProjectStatus.InterestingCold, ProjectStatus.New, true)] // Backwards
    [TestCase(ProjectStatus.New, ProjectStatus.NotInteresting, true)]
    [TestCase(ProjectStatus.InterestingCold, ProjectStatus.NotInteresting, true)]
    [TestCase(ProjectStatus.InterestingContacted, ProjectStatus.NotInteresting, true)]
    [TestCase(ProjectStatus.InterestingInProgress, ProjectStatus.NotInteresting, true)]
    [TestCase(ProjectStatus.New, ProjectStatus.MissedOpportunity, true)]
    [TestCase(ProjectStatus.InterestingCold, ProjectStatus.MissedOpportunity, true)]
    [TestCase(ProjectStatus.InterestingContacted, ProjectStatus.MissedOpportunity, true)]
    [TestCase(ProjectStatus.InterestingInProgress, ProjectStatus.MissedOpportunity, true)]
    [TestCase(ProjectStatus.NotInteresting, ProjectStatus.New, true)]
    [TestCase(ProjectStatus.MissedOpportunity, ProjectStatus.InterestingCold, true)]
    [TestCase(ProjectStatus.Won, ProjectStatus.InterestingInProgress, true)] // Correction
    [TestCase(ProjectStatus.Lost, ProjectStatus.InterestingInProgress, true)] // Correction
    [TestCase(ProjectStatus.New, ProjectStatus.New, true)] // Same status
    [TestCase(ProjectStatus.New, ProjectStatus.Won, false)]
    [TestCase(ProjectStatus.InterestingCold, ProjectStatus.Lost, false)]
    [TestCase(ProjectStatus.NotInteresting, ProjectStatus.Won, false)]
    [TestCase(ProjectStatus.MissedOpportunity, ProjectStatus.Lost, false)]
    public async Task IsValidStatusTransitionAsync_VariousTransitions_ShouldReturnExpected(ProjectStatus current, ProjectStatus next, bool expected)
    {
        var result = await _service.IsValidStatusTransitionAsync(current, next);
        Assert.That(result, Is.EqualTo(expected));
    }

    // Tests for UpdateProjectStatusAsync
    [Test]
    public async Task UpdateProjectStatusAsync_ValidTransition_ShouldUpdateStatusAndAddHistory()
    {
        var project = await _context.ProjectDetails.FindAsync(_testProjectId);
        Assert.That(project!.CurrentStatus, Is.EqualTo(ProjectStatus.New));

        var result = await _service.UpdateProjectStatusAsync(_testProjectId, ProjectStatus.InterestingCold, "Contacted client", "Tobias");

        Assert.That(result, Is.True);
        var updatedProject = await _context.ProjectDetails.FindAsync(_testProjectId);
        Assert.That(updatedProject!.CurrentStatus, Is.EqualTo(ProjectStatus.InterestingCold));

        var historyEntry = await _context.ProjectStatusHistories.FirstOrDefaultAsync(h => h.ProjectId == _testProjectId);
        Assert.That(historyEntry, Is.Not.Null);
        Assert.That(historyEntry!.Status, Is.EqualTo(ProjectStatus.InterestingCold));
        Assert.That(historyEntry.Comment, Is.EqualTo("Contacted client"));
        Assert.That(historyEntry.ChangedBy, Is.EqualTo("Tobias"));
    }

    [Test]
    public async Task UpdateProjectStatusAsync_InvalidTransition_ShouldReturnFalseAndNotUpdate()
    {
        var project = await _context.ProjectDetails.FindAsync(_testProjectId);
        var originalStatus = project!.CurrentStatus;

        var result = await _service.UpdateProjectStatusAsync(_testProjectId, ProjectStatus.Won, "Jumped to won", "Tobias"); // Invalid from New

        Assert.That(result, Is.False);
        var notUpdatedProject = await _context.ProjectDetails.FindAsync(_testProjectId);
        Assert.That(notUpdatedProject!.CurrentStatus, Is.EqualTo(originalStatus));
        Assert.That(_context.ProjectStatusHistories.Count(h => h.ProjectId == _testProjectId), Is.EqualTo(0));
    }
    
    [Test]
    public async Task UpdateProjectStatusAsync_ProjectNotFound_ShouldReturnFalse()
    {
        var nonExistentProjectId = Guid.NewGuid();
        var result = await _service.UpdateProjectStatusAsync(nonExistentProjectId, ProjectStatus.InterestingCold, "Test", "Tobias");
        Assert.That(result, Is.False);
    }

    [TestCase(ProjectStatus.Lost, "Lost the project", true)]
    [TestCase(ProjectStatus.NotInteresting, "Not a good fit", true)]
    [TestCase(ProjectStatus.MissedOpportunity, "Too late", true)]
    [TestCase(ProjectStatus.Lost, null, false)] // Comment required
    [TestCase(ProjectStatus.NotInteresting, " ", false)] // Comment required (whitespace)
    [TestCase(ProjectStatus.MissedOpportunity, "", false)] // Comment required (empty)
    public async Task UpdateProjectStatusAsync_CommentRequirement_ShouldValidate(ProjectStatus newStatus, string? comment, bool expectedSuccess)
    {
        // First, move to a state from which these are valid transitions
        var project = await _context.ProjectDetails.FindAsync(_testProjectId);
        project!.CurrentStatus = ProjectStatus.InterestingInProgress;
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        var result = await _service.UpdateProjectStatusAsync(_testProjectId, newStatus, comment, "Tobias");
        Assert.That(result, Is.EqualTo(expectedSuccess));

        if (expectedSuccess)
        {
            var updatedProject = await _context.ProjectDetails.FindAsync(_testProjectId);
            Assert.That(updatedProject!.CurrentStatus, Is.EqualTo(newStatus));
            var historyEntry = await _context.ProjectStatusHistories.OrderByDescending(h => h.Timestamp).FirstAsync(h => h.ProjectId == _testProjectId);
            Assert.That(historyEntry.Comment, Is.EqualTo(comment));
        }
        else
        {
            var notUpdatedProject = await _context.ProjectDetails.FindAsync(_testProjectId);
            Assert.That(notUpdatedProject!.CurrentStatus, Is.EqualTo(ProjectStatus.InterestingInProgress)); // Should remain
        }
    }
    
    // Tests for SetInitialProjectStatusAsync
    [Test]
    public async Task SetInitialProjectStatusAsync_ShouldSetStatusToNewAndAddHistory()
    {
        var newProjectId = Guid.NewGuid();
        _context.ProjectDetails.Add(new ProjectDetails { Id = newProjectId, Title = "New Project", CreatedAt = DateTime.UtcNow });
        // Note: CurrentStatus might be default(ProjectStatus) which is 'New', or uninitialized.
        // The service method explicitly sets it.
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        await _service.SetInitialProjectStatusAsync(newProjectId);

        var project = await _context.ProjectDetails.FindAsync(newProjectId);
        Assert.That(project, Is.Not.Null);
        Assert.That(project!.CurrentStatus, Is.EqualTo(ProjectStatus.New));

        var historyEntry = await _context.ProjectStatusHistories.FirstOrDefaultAsync(h => h.ProjectId == newProjectId);
        Assert.That(historyEntry, Is.Not.Null);
        Assert.That(historyEntry!.Status, Is.EqualTo(ProjectStatus.New));
        Assert.That(historyEntry.Comment, Is.EqualTo("Automatisch generiert"));
        Assert.That(historyEntry.ChangedBy, Is.EqualTo("System"));
    }

    [Test]
    public async Task SetInitialProjectStatusAsync_WithCustomCommentAndUser_ShouldUseThem()
    {
        var newProjectId = Guid.NewGuid();
         _context.ProjectDetails.Add(new ProjectDetails { Id = newProjectId, Title = "Another New Project", CreatedAt = DateTime.UtcNow });
        await _context.SaveChangesAsync();
        _context.ChangeTracker.Clear();

        await _service.SetInitialProjectStatusAsync(newProjectId, "Manually created", "Tobias W.");

        var project = await _context.ProjectDetails.FindAsync(newProjectId);
        Assert.That(project!.CurrentStatus, Is.EqualTo(ProjectStatus.New));

        var historyEntry = await _context.ProjectStatusHistories.FirstOrDefaultAsync(h => h.ProjectId == newProjectId);
        Assert.That(historyEntry, Is.Not.Null);
        Assert.That(historyEntry.Status, Is.EqualTo(ProjectStatus.New));
        Assert.That(historyEntry.Comment, Is.EqualTo("Manually created"));
        Assert.That(historyEntry.ChangedBy, Is.EqualTo("Tobias W."));
    }
    
    [Test]
    public async Task SetInitialProjectStatusAsync_ProjectNotFound_ShouldLogWarningAndNotThrow()
    {
        var nonExistentProjectId = Guid.NewGuid();
        
        // Ensure no exception is thrown
        Assert.DoesNotThrowAsync(async () => await _service.SetInitialProjectStatusAsync(nonExistentProjectId));

        // Verify logger was called (optional, but good for checking behavior)
        _logger.Received(1).Log(
            LogLevel.Warning,
            Arg.Any<EventId>(),
            Arg.Is<object>(o => o.ToString()!.Contains($"Project with ID {nonExistentProjectId} not found for setting initial status.")),
            null,
            Arg.Any<Func<object, Exception?, string>>());
            
        Assert.That(await _context.ProjectStatusHistories.AnyAsync(h => h.ProjectId == nonExistentProjectId), Is.False);
    }
}
