using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;
using ntlt.projectradar.backend.tests.TestHelper;

namespace ntlt.projectradar.backend.tests.Services;

[TestFixture]
public class RawLeadServiceTests
{
    [SetUp]
    public void Setup()
    {
        // Create In-Memory database with unique name for each test
        var options = new DbContextOptionsBuilder<ProjectRadarContext>()
            .UseInMemoryDatabase(TestGuids.DatabaseId1.ToString())
            .Options;

        _context = new ProjectRadarContext(options);
        _logger = Substitute.For<ILogger<RawLeadService>>();
        _mockGuidService = new MockGuidService([TestGuids.TestId1, TestGuids.TestId2, TestGuids.TestId3]);
        _service = new RawLeadService(_context, _mockGuidService, _logger);

        // Ensure database is created
        _context.Database.EnsureCreated();
    }

    [TearDown]
    public void TearDown()
    {
        // Clear all tracked entities from the context
        _context.ChangeTracker.Clear();

        // Delete and recreate the database to ensure clean state
        _context.Database.EnsureDeleted();

        _context.Dispose();
    }

    private ProjectRadarContext _context = null!;
    private ILogger<RawLeadService> _logger = null!;
    private IGuidService _mockGuidService = null!;
    private RawLeadService _service = null!;

    [Test]
    public async Task CreateRawLeadAsync_WithValidEmlContent_ShouldCreateRawLead()
    {
        // Arrange
        const string emlContent = "From: test@example.com\nSubject: Test Project\nBody content here";

        // Act
        var result = await _service.CreateRawLeadAsync(emlContent); // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(TestGuids.TestId1));
        Assert.That(result.OriginalContent, Is.EqualTo(emlContent));
        Assert.That(result.ProcessingStatus, Is.EqualTo(ProcessingStatus.Processing));
        Assert.That(result.UploadedAt, Is.LessThanOrEqualTo(DateTime.UtcNow));
        Assert.That(result.UploadedAt, Is.GreaterThan(DateTime.UtcNow.AddMinutes(-1)));

        // Verify it was saved to database
        var savedRawLead = await _context.RawLeads.FindAsync(result.Id);
        Assert.That(savedRawLead, Is.Not.Null);
        Assert.That(savedRawLead!.OriginalContent, Is.EqualTo(emlContent));
    }

    [Test]
    public async Task CreateRawLeadAsync_WithEmptyContent_ShouldCreateRawLead()
    {
        // Arrange
        const string emlContent = "";

        // Act
        var result = await _service.CreateRawLeadAsync(emlContent);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.OriginalContent, Is.EqualTo(emlContent));
        Assert.That(result.ProcessingStatus, Is.EqualTo(ProcessingStatus.Processing));
    }

    [Test]
    public async Task CreateRawLeadAsync_WithLargeContent_ShouldCreateRawLead()
    {
        // Arrange
        var largeContent = new string('A', 100000); // 100KB content

        // Act
        var result = await _service.CreateRawLeadAsync(largeContent);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.OriginalContent, Is.EqualTo(largeContent));
        Assert.That(result.OriginalContent.Length, Is.EqualTo(100000));
    }

    [Test]
    public async Task CreateRawLeadAsync_ShouldGenerateUniqueIds()
    {
        // Arrange
        const string emlContent1 = "Email 1 content";
        const string emlContent2 = "Email 2 content";

        // Act
        var result1 = await _service.CreateRawLeadAsync(emlContent1);
        var result2 = await _service.CreateRawLeadAsync(emlContent2); // Assert
        Assert.That(result1.Id, Is.EqualTo(TestGuids.TestId1));
        Assert.That(result2.Id, Is.EqualTo(TestGuids.TestId2));
        Assert.That(result1.Id, Is.Not.EqualTo(result2.Id));
    }

    [Test]
    public async Task GetRawLeadByIdAsync_WithExistingId_ShouldReturnRawLead()
    {
        // Arrange
        var rawLead = await _service.CreateRawLeadAsync("Test content");

        // Act
        var result = await _service.GetRawLeadByIdAsync(rawLead.Id);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Id, Is.EqualTo(rawLead.Id));
        Assert.That(result.OriginalContent, Is.EqualTo("Test content"));
    }

    [Test]
    public async Task GetRawLeadByIdAsync_WithNonExistingId_ShouldReturnNull()
    {
        // Arrange
        var nonExistingId = TestGuids.NonExistingId;

        // Act
        var result = await _service.GetRawLeadByIdAsync(nonExistingId);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetRawLeadByIdAsync_WithEmptyGuid_ShouldReturnNull()
    {
        // Arrange
        var emptyId = Guid.Empty;

        // Act
        var result = await _service.GetRawLeadByIdAsync(emptyId);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetRawLeadsAsync_WithNoFilter_ShouldReturnAllRawLeads()
    {
        // Arrange
        await _service.CreateRawLeadAsync("Content 1");
        await _service.CreateRawLeadAsync("Content 2");
        await _service.CreateRawLeadAsync("Content 3");

        // Act
        var result = await _service.GetRawLeadsAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count, Is.EqualTo(3));
    }

    [Test]
    public async Task GetRawLeadsAsync_WithStatusFilter_ShouldReturnFilteredRawLeads()
    {
        // Arrange
        var rawLead1 = await _service.CreateRawLeadAsync("Content 1");
        var rawLead2 = await _service.CreateRawLeadAsync("Content 2");
        var rawLead3 = await _service.CreateRawLeadAsync("Content 3");

        // Update statuses
        await _service.UpdateProcessingStatusAsync(rawLead1.Id, ProcessingStatus.Processing);
        await _service.UpdateProcessingStatusAsync(rawLead2.Id, ProcessingStatus.Completed);

        // Act - filter by Processing status
        var processingResults = await _service.GetRawLeadsAsync(ProcessingStatus.Processing);
        var completedResults = await _service.GetRawLeadsAsync(ProcessingStatus.Completed);

        // Assert
        Assert.That(processingResults.Count, Is.EqualTo(2));
        Assert.That(processingResults[0].Id, Is.EqualTo(rawLead3.Id));

        Assert.That(completedResults.Count, Is.EqualTo(1));
        Assert.That(completedResults[0].Id, Is.EqualTo(rawLead2.Id));
    }

    [Test]
    public async Task GetRawLeadsAsync_ShouldReturnOrderedByUploadDateDescending()
    {
        // Arrange - create with different timestamps
        var rawLead1 = await _service.CreateRawLeadAsync("Content 1");
        await Task.Delay(10); // Ensure different timestamps
        var rawLead2 = await _service.CreateRawLeadAsync("Content 2");
        await Task.Delay(10);
        var rawLead3 = await _service.CreateRawLeadAsync("Content 3");

        // Act
        var result = await _service.GetRawLeadsAsync();

        // Assert
        Assert.That(result.Count, Is.EqualTo(3));
        // Should be ordered by UploadedAt DESC (newest first)
        Assert.That(result[0].Id, Is.EqualTo(rawLead3.Id));
        Assert.That(result[1].Id, Is.EqualTo(rawLead2.Id));
        Assert.That(result[2].Id, Is.EqualTo(rawLead1.Id));
    }

    [Test]
    public async Task GetRawLeadsAsync_WithEmptyDatabase_ShouldReturnEmptyList()
    {
        // Act
        var result = await _service.GetRawLeadsAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count, Is.EqualTo(0));
    }

    [Test]
    public async Task UpdateProcessingStatusAsync_WithExistingId_ShouldUpdateStatus()
    {
        // Arrange
        var rawLead = await _service.CreateRawLeadAsync("Test content");
        Assert.That(rawLead.ProcessingStatus, Is.EqualTo(ProcessingStatus.Processing));

        // Act
        var result = await _service.UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed);

        // Assert
        Assert.That(result, Is.True);

        // Verify status was updated in database
        var updatedRawLead = await _service.GetRawLeadByIdAsync(rawLead.Id);
        Assert.That(updatedRawLead, Is.Not.Null);
        Assert.That(updatedRawLead!.ProcessingStatus, Is.EqualTo(ProcessingStatus.Completed));
    }

    [Test]
    public async Task UpdateProcessingStatusAsync_WithNonExistingId_ShouldReturnFalse()
    {
        // Arrange
        var nonExistingId = TestGuids.NonExistingId;

        // Act
        var result = await _service.UpdateProcessingStatusAsync(nonExistingId, ProcessingStatus.Completed);

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public async Task UpdateProcessingStatusAsync_ShouldUpdateToAllValidStatuses()
    {
        // Arrange
        var rawLead = await _service.CreateRawLeadAsync("Test content");

        // Act & Assert - Test all status transitions
        var statuses = new[]
        {
            ProcessingStatus.Processing, ProcessingStatus.Completed, ProcessingStatus.Failed,
            ProcessingStatus.Processing
        };

        foreach (var status in statuses)
        {
            var result = await _service.UpdateProcessingStatusAsync(rawLead.Id, status);
            Assert.That(result, Is.True, $"Failed to update to status: {status}");

            var updatedRawLead = await _service.GetRawLeadByIdAsync(rawLead.Id);
            Assert.That(updatedRawLead!.ProcessingStatus, Is.EqualTo(status), $"Status not updated to: {status}");
        }
    }

    [Test]
    public async Task DeleteRawLeadAsync_WithExistingId_ShouldDeleteRawLead()
    {
        // Arrange
        var rawLead = await _service.CreateRawLeadAsync("Test content");

        // Act
        var result = await _service.DeleteRawLeadAsync(rawLead.Id);

        // Assert
        Assert.That(result, Is.True);

        // Verify it was deleted from database
        var deletedRawLead = await _service.GetRawLeadByIdAsync(rawLead.Id);
        Assert.That(deletedRawLead, Is.Null);
    }

    [Test]
    public async Task DeleteRawLeadAsync_WithNonExistingId_ShouldReturnFalse()
    {
        // Arrange
        var nonExistingId = TestGuids.NonExistingId;

        // Act
        var result = await _service.DeleteRawLeadAsync(nonExistingId);

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public async Task DeleteRawLeadAsync_ShouldNotAffectOtherRawLeads()
    {
        // Arrange
        var rawLead1 = await _service.CreateRawLeadAsync("Content 1");
        var rawLead2 = await _service.CreateRawLeadAsync("Content 2");
        var rawLead3 = await _service.CreateRawLeadAsync("Content 3");

        // Act
        var result = await _service.DeleteRawLeadAsync(rawLead2.Id);

        // Assert
        Assert.That(result, Is.True);

        // Verify only rawLead2 was deleted
        var remaining = await _service.GetRawLeadsAsync();
        Assert.That(remaining.Count, Is.EqualTo(2));
        Assert.That(remaining.Any(r => r.Id == rawLead1.Id), Is.True);
        Assert.That(remaining.Any(r => r.Id == rawLead2.Id), Is.False);
        Assert.That(remaining.Any(r => r.Id == rawLead3.Id), Is.True);
    }

    [Test]
    public async Task CompleteWorkflow_CreateUpdateAndDelete_ShouldWorkCorrectly()
    {
        // Arrange
        const string emlContent =
            "From: client@example.com\nSubject: New Project Inquiry\n\nWe need a web application...";

        // Act & Assert - Create
        var rawLead = await _service.CreateRawLeadAsync(emlContent);
        Assert.That(rawLead.ProcessingStatus, Is.EqualTo(ProcessingStatus.Processing));

        // Act & Assert - Update Status to Processing
        var updateResult1 = await _service.UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Processing);
        Assert.That(updateResult1, Is.True);

        var processingRawLead = await _service.GetRawLeadByIdAsync(rawLead.Id);
        Assert.That(processingRawLead!.ProcessingStatus, Is.EqualTo(ProcessingStatus.Processing));

        // Act & Assert - Update Status to Completed
        var updateResult2 = await _service.UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed);
        Assert.That(updateResult2, Is.True);

        var completedRawLead = await _service.GetRawLeadByIdAsync(rawLead.Id);
        Assert.That(completedRawLead!.ProcessingStatus, Is.EqualTo(ProcessingStatus.Completed));

        // Act & Assert - Delete
        var deleteResult = await _service.DeleteRawLeadAsync(rawLead.Id);
        Assert.That(deleteResult, Is.True);

        var deletedRawLead = await _service.GetRawLeadByIdAsync(rawLead.Id);
        Assert.That(deletedRawLead, Is.Null);
    }

    [Test]
    public async Task ConcurrentOperations_ShouldHandleMultipleUsers()
    {
        // Arrange - Create service with enough GUIDs for this test
        var guidsForTest = new List<Guid>
        {
            TestGuids.TestId1, TestGuids.TestId2, TestGuids.TestId3, TestGuids.TestId4, TestGuids.TestId5,
            new("66666666-6666-6666-6666-666666666666"),
            new("77777777-7777-7777-7777-777777777777"),
            new("88888888-8888-8888-8888-888888888888"),
            new("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
            new("ffffffff-ffff-ffff-ffff-ffffffffffff")
        };

        var testGuidService = new MockGuidService(guidsForTest);
        var testService = new RawLeadService(_context, testGuidService, _logger);

        var tasks = new List<Task<RawLead>>();

        // Act - Create multiple RawLeads concurrently
        for (var i = 0; i < 10; i++)
        {
            var content = $"Email content {i}";
            tasks.Add(testService.CreateRawLeadAsync(content));
        }

        var results = await Task.WhenAll(tasks);

        // Assert
        Assert.That(results.Length, Is.EqualTo(10));
        Assert.That(results.Select(r => r.Id).Distinct().Count(), Is.EqualTo(10), "All IDs should be unique");

        var allRawLeads = await testService.GetRawLeadsAsync();
        Assert.That(allRawLeads.Count, Is.EqualTo(10));
    }
}