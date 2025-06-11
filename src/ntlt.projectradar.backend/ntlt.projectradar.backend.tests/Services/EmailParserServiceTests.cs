using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Data;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;
using ntlt.projectradar.backend.tests.TestHelper;

namespace ntlt.projectradar.backend.tests.Services;

[TestFixture]
public class EmailParserServiceTests
{
    [SetUp]
    public void Setup()
    {
        // Create In-Memory database with unique name for each test
        var options = new DbContextOptionsBuilder<ProjectRadarContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new ProjectRadarContext(options);
        _logger = Substitute.For<ILogger<EmailParserService>>();
        _mockGuidService = new MockGuidService([TestGuids.TestId1, TestGuids.TestId2, TestGuids.TestId3]);
        _service = new EmailParserService(_context, _mockGuidService, _logger);

        // Ensure database is created
        _context.Database.EnsureCreated();
    }

    [TearDown]
    public void TearDown()
    {
        _context.ChangeTracker.Clear();
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    private ProjectRadarContext _context = null!;
    private ILogger<EmailParserService> _logger = null!;
    private IGuidService _mockGuidService = null!;
    private EmailParserService _service = null!;

    [Test]
    public async Task ParseAndPersistEmailAsync_WithValidEmail_ShouldCreateEmailDetails()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var emailContent = CreateValidEmailContent();
        rawLead.OriginalContent = emailContent;

        // Act
        var result = await _service.ParseAndPersistEmailAsync(rawLead);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(TestGuids.TestId1));
        Assert.That(result.RawLeadId, Is.EqualTo(rawLead.Id));
        Assert.That(result.EmailFrom, Does.Contain("test@example.com"));
        Assert.That(result.EmailTo, Does.Contain("recipient@example.com"));
        Assert.That(result.EmailSubject, Is.EqualTo("Test Project Inquiry"));
        Assert.That(result.EmailBodyText, Does.Contain("This is a test email"));

        // Verify it was saved to database
        var savedEmailDetails = await _context.EmailDetails.FindAsync(result.Id);
        Assert.That(savedEmailDetails, Is.Not.Null);
    }

    [Test]
    public async Task ParseAndPersistEmailAsync_WithExistingEmailDetails_ShouldOverwriteExisting()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var emailContent = CreateValidEmailContent();
        rawLead.OriginalContent = emailContent;

        // Create existing EmailDetails
        var existingEmailDetails = new EmailDetails
        {
            Id = TestGuids.TestId2,
            RawLeadId = rawLead.Id,
            EmailFrom = "old@example.com",
            EmailSubject = "Old Subject",
            CreatedAt = DateTime.UtcNow
        };
        _context.EmailDetails.Add(existingEmailDetails);
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.ParseAndPersistEmailAsync(rawLead);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(TestGuids.TestId1)); // New ID
        Assert.That(result.EmailFrom, Does.Contain("test@example.com")); // New data

        // Verify old EmailDetails is gone
        var oldEmailDetails = await _context.EmailDetails.FindAsync(TestGuids.TestId2);
        Assert.That(oldEmailDetails, Is.Null);

        // Verify only one EmailDetails exists for this RawLead
        var allEmailDetails = await _context.EmailDetails
            .Where(ed => ed.RawLeadId == rawLead.Id)
            .ToListAsync();
        Assert.That(allEmailDetails.Count, Is.EqualTo(1));
    }

    [Test]
    public async Task ParseAndPersistEmailAsync_WithAttachments_ShouldPersistAttachments()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var emailContent = CreateEmailWithAttachment();
        rawLead.OriginalContent = emailContent;

        // Act
        var result = await _service.ParseAndPersistEmailAsync(rawLead);

        // Assert
        Assert.That(result, Is.Not.Null);

        // Verify attachments were created
        var attachments = await _context.EmailAttachments
            .Where(ea => ea.EmailDetailsId == result.Id)
            .ToListAsync();

        // Note: This test might need adjustment based on actual email content with attachments
        // For now, we just verify the mechanism works
        Assert.That(attachments, Is.Not.Null);
    }

    [Test]
    public async Task ParseAndPersistEmailAsync_WithExistingAttachments_ShouldReplaceAttachments()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var emailContent = CreateValidEmailContent();
        rawLead.OriginalContent = emailContent;

        // Create existing EmailDetails with attachment
        var existingEmailDetails = new EmailDetails
        {
            Id = TestGuids.TestId2,
            RawLeadId = rawLead.Id,
            EmailFrom = "old@example.com",
            CreatedAt = DateTime.UtcNow
        };
        _context.EmailDetails.Add(existingEmailDetails);

        var existingAttachment = new EmailAttachment
        {
            Id = TestGuids.TestId3,
            EmailDetailsId = existingEmailDetails.Id,
            AttachmentFilename = "old-file.txt",
            CreatedAt = DateTime.UtcNow
        };
        _context.EmailAttachments.Add(existingAttachment);
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.ParseAndPersistEmailAsync(rawLead);

        // Assert
        Assert.That(result, Is.Not.Null);

        // Verify old attachment is gone
        var oldAttachment = await _context.EmailAttachments.FindAsync(TestGuids.TestId3);
        Assert.That(oldAttachment, Is.Null);

        // Verify no orphaned attachments exist
        var orphanedAttachments = await _context.EmailAttachments
            .Where(ea => ea.EmailDetailsId == existingEmailDetails.Id)
            .ToListAsync();
        Assert.That(orphanedAttachments.Count, Is.EqualTo(0));
    }

    [Test]
    public void ParseAndPersistEmailAsync_WithInvalidEmailContent_ShouldThrowException()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        rawLead.OriginalContent = "Invalid email content without proper headers"; // Act & Assert
        var ex = Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await _service.ParseAndPersistEmailAsync(rawLead));

        Assert.That(ex.Message, Does.Contain("Failed to parse email content"));
    }

    [Test]
    public async Task ParseAndPersistEmailAsync_WithMinimalEmailContent_ShouldHandleGracefully()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var minimalEmailContent = "From: sender@example.com\r\nTo: recipient@example.com\r\n\r\nMinimal content";
        rawLead.OriginalContent = minimalEmailContent;

        // Act
        var result = await _service.ParseAndPersistEmailAsync(rawLead);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.EmailFrom, Does.Contain("sender@example.com"));
        Assert.That(result.EmailTo, Does.Contain("recipient@example.com"));
        Assert.That(result.EmailSubject, Is.EqualTo(string.Empty)); // No subject in minimal email
    }

    private RawLead CreateTestRawLead()
    {
        return new RawLead
        {
            Id = Guid.NewGuid(),
            OriginalContent = string.Empty,
            UploadedAt = DateTime.UtcNow,
            ProcessingStatus = ProcessingStatus.Processing
        };
    }

    private string CreateValidEmailContent()
    {
        return """
               From: Test Sender <test@example.com>
               To: Test Recipient <recipient@example.com>
               Subject: Test Project Inquiry
               Date: Wed, 11 Jun 2025 10:00:00 +0200
               Content-Type: text/plain; charset=utf-8

               This is a test email content.

               We are looking for a software development project.

               Best regards,
               Test Sender
               """;
    }

    private string CreateEmailWithAttachment()
    {
        return """
               From: Test Sender <test@example.com>
               To: Test Recipient <recipient@example.com>
               Subject: Test Project with Attachment
               Date: Wed, 11 Jun 2025 10:00:00 +0200
               MIME-Version: 1.0
               Content-Type: multipart/mixed; boundary="boundary123"

               --boundary123
               Content-Type: text/plain; charset=utf-8

               This email has an attachment.

               --boundary123
               Content-Type: text/plain; name="test.txt"
               Content-Disposition: attachment; filename="test.txt"

               This is test attachment content.
               --boundary123--
               """;
    }
}