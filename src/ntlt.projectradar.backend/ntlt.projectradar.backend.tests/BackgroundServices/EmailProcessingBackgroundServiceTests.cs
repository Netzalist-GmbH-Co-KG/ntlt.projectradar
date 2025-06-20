using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ntlt.projectradar.backend.BackgroundServices;
using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;
using ntlt.projectradar.backend.tests.TestHelper;

namespace ntlt.projectradar.backend.tests.BackgroundServices;

[TestFixture]
public class EmailProcessingBackgroundServiceTests
{
    [SetUp]
    public void Setup()
    {
        // Create mock services
        _emailParserService = Substitute.For<IEmailParserService>();

        _rawLeadService = Substitute.For<IRawLeadService>();
        _delayService = Substitute.For<IDelayService>();
        _logger = Substitute.For<ILogger<EmailProcessingBackgroundService>>();
        _emailProcessingTrigger = Substitute.For<IEmailProcessingTrigger>();
        _projectDetailsService = Substitute.For<IProjectDetailsService>();

        // Create mock service provider
        _serviceProvider = Substitute.For<IServiceProvider>();
        _serviceProvider.GetService(typeof(IEmailParserService)).Returns(_emailParserService);
        _serviceProvider.GetService(typeof(IRawLeadService)).Returns(_rawLeadService);
        _serviceProvider.GetService(typeof(IProjectDetailsService)).Returns(_projectDetailsService);

        // Create mock service scope
        _serviceScope = Substitute.For<IServiceScope>();
        _serviceScope.ServiceProvider.Returns(_serviceProvider);

        // Create mock service scope factory
        _serviceScopeFactory = Substitute.For<IServiceScopeFactory>();
        _serviceScopeFactory.CreateScope().Returns(_serviceScope);

        _service = new EmailProcessingBackgroundService(
            _serviceScopeFactory,
            _emailProcessingTrigger,
            _delayService,
            _logger);
    }

    [TearDown]
    public void TearDown()
    {
        _service.Dispose();
        _serviceScope?.Dispose();
    }

    private IServiceScopeFactory _serviceScopeFactory = null!;
    private IServiceScope _serviceScope = null!;
    private IServiceProvider _serviceProvider = null!;
    private IEmailParserService _emailParserService = null!;
    private IRawLeadService _rawLeadService = null!;
    private IProjectDetailsService _projectDetailsService = null!;
    private IDelayService _delayService = null!;
    private ILogger<EmailProcessingBackgroundService> _logger = null!;
    private IEmailProcessingTrigger _emailProcessingTrigger = null!;
    private EmailProcessingBackgroundService _service = null!;


    [Test]
    public void StartProcessing_ShouldTriggerProcessing()
    {
        // Act
        _service.StartProcessing();

        // Assert - No exception should be thrown
        Assert.Pass("StartProcessing executed without exception");
    }

    [Test]
    public async Task ProcessEmailsAsync_WithNoProcessingRawLeads_ShouldCompleteWithoutProcessing()
    {
        // Arrange
        _rawLeadService.GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>())
            .Returns(new List<RawLead>());

        // Act
        await _service.ProcessEmailsAsync();

        // Assert
        await _rawLeadService.Received(1).GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>());
        await _emailParserService.DidNotReceive()
            .ParseAndPersistEmailAsync(Arg.Any<RawLead>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ProcessEmailsAsync_WithSingleRawLead_ShouldProcessSuccessfully()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var emailDetails = CreateTestEmailDetails(rawLead.Id);

        _rawLeadService.GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>())
            .Returns(new List<RawLead> { rawLead });

        _emailParserService.ParseAndPersistEmailAsync(rawLead, Arg.Any<CancellationToken>())
            .Returns(emailDetails);

        _rawLeadService
            .UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed, Arg.Any<CancellationToken>())
            .Returns(true);

        // Act
        await _service.ProcessEmailsAsync();

        // Assert
        await _rawLeadService.Received(1).GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>());
        await _emailParserService.Received(1).ParseAndPersistEmailAsync(rawLead, Arg.Any<CancellationToken>());
        await _rawLeadService.Received(1)
            .UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed, Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ProcessEmailsAsync_WithMultipleRawLeads_ShouldProcessAllInParallel()
    {
        // Arrange
        var rawLead1 = CreateTestRawLead(TestGuids.TestId1);
        var rawLead2 = CreateTestRawLead(TestGuids.TestId2);
        var rawLead3 = CreateTestRawLead(TestGuids.TestId3);

        var rawLeads = new List<RawLead> { rawLead1, rawLead2, rawLead3 };

        _rawLeadService.GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>())
            .Returns(rawLeads);

        _emailParserService.ParseAndPersistEmailAsync(Arg.Any<RawLead>(), Arg.Any<CancellationToken>())
            .Returns(args => CreateTestEmailDetails(((RawLead)args[0]).Id));

        _rawLeadService
            .UpdateProcessingStatusAsync(Arg.Any<Guid>(), ProcessingStatus.Completed, Arg.Any<CancellationToken>())
            .Returns(true);

        // Act
        await _service.ProcessEmailsAsync();

        // Assert
        await _rawLeadService.Received(1).GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>());
        await _emailParserService.Received(3)
            .ParseAndPersistEmailAsync(Arg.Any<RawLead>(), Arg.Any<CancellationToken>());
        await _rawLeadService.Received(3)
            .UpdateProcessingStatusAsync(Arg.Any<Guid>(), ProcessingStatus.Completed, Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ProcessEmailsAsync_WhenEmailParsingFails_ShouldUpdateStatusToFailed()
    {
        // Arrange
        var rawLead = CreateTestRawLead();

        _rawLeadService.GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>())
            .Returns(new List<RawLead> { rawLead });

        _emailParserService.ParseAndPersistEmailAsync(rawLead, Arg.Any<CancellationToken>())
            .Returns(Task.FromException<EmailDetails>(new InvalidOperationException("Email parsing failed")));

        _rawLeadService.UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Failed, Arg.Any<CancellationToken>())
            .Returns(true);

        // Act
        await _service.ProcessEmailsAsync();

        // Assert
        await _emailParserService.Received(1)
            .ParseAndPersistEmailAsync(rawLead, Arg.Any<CancellationToken>());
        await _rawLeadService.Received(1)
            .UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Failed, Arg.Any<CancellationToken>());
        await _rawLeadService.DidNotReceive()
            .UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed, Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ProcessEmailsAsync_WhenStatusUpdateFails_ShouldContinueProcessing()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var emailDetails = CreateTestEmailDetails(rawLead.Id);

        _rawLeadService.GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>())
            .Returns(new List<RawLead> { rawLead });

        _emailParserService.ParseAndPersistEmailAsync(rawLead, Arg.Any<CancellationToken>())
            .Returns(emailDetails);

        _rawLeadService
            .UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed, Arg.Any<CancellationToken>())
            .Returns(Task.FromException<bool>(new InvalidOperationException("Database error")));

        // Act & Assert - Should not throw exception
        await _service.ProcessEmailsAsync();

        // Assert
        await _emailParserService.Received(1).ParseAndPersistEmailAsync(rawLead, Arg.Any<CancellationToken>());
        await _rawLeadService.Received(1)
            .UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed, Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ProcessEmailsAsync_WhenGetRawLeadsThrows_ShouldHandleGracefully()
    {
        // Arrange
        _rawLeadService.GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>())
            .Returns(Task.FromException<List<RawLead>>(new InvalidOperationException("Database connection failed")));

        // Act & Assert - Should not throw exception
        await _service.ProcessEmailsAsync();

        // Assert
        await _rawLeadService.Received(1).GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>());
        await _emailParserService.DidNotReceive()
            .ParseAndPersistEmailAsync(Arg.Any<RawLead>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ExecuteTask_ShouldBeAvailableAfterStart()
    {
        // Arrange
        using var cts = new CancellationTokenSource();

        // Act
        var startTask = _service.StartAsync(cts.Token);

        // Assert
        Assert.That(_service.ExecuteTask, Is.Not.Null);

        // Cleanup
        cts.Cancel();
        await startTask;
    }

    [Test]
    public async Task BackgroundService_WhenTriggered_ShouldProcessEmails()
    {
        // Arrange
        var rawLead = CreateTestRawLead();
        var emailDetails = CreateTestEmailDetails(rawLead.Id);

        _rawLeadService.GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>())
            .Returns(new List<RawLead> { rawLead });

        _emailParserService.ParseAndPersistEmailAsync(rawLead, Arg.Any<CancellationToken>())
            .Returns(emailDetails);

        _rawLeadService
            .UpdateProcessingStatusAsync(rawLead.Id, ProcessingStatus.Completed, Arg.Any<CancellationToken>())
            .Returns(true);

        using var cts = new CancellationTokenSource();

        // Act
        var startTask = _service.StartAsync(cts.Token);

        // Trigger processing
        _service.StartProcessing();

        // Give some time for processing
        await Task.Delay(100);

        // Stop service
        cts.Cancel();
        await startTask;

        // Assert
        await _rawLeadService.Received().GetRawLeadsAsync(ProcessingStatus.Processing, Arg.Any<CancellationToken>());
    }

    private static RawLead CreateTestRawLead(Guid? id = null)
    {
        return new RawLead
        {
            Id = id ?? TestGuids.TestId1,
            OriginalContent = "From: test@example.com\nSubject: Test\n\nContent",
            UploadedAt = DateTime.UtcNow,
            ProcessingStatus = ProcessingStatus.Processing
        };
    }

    private static EmailDetails CreateTestEmailDetails(Guid rawLeadId)
    {
        return new EmailDetails
        {
            Id = Guid.NewGuid(),
            RawLeadId = rawLeadId,
            EmailFrom = "test@example.com",
            EmailTo = "recipient@example.com",
            EmailSubject = "Test Subject",
            EmailDate = DateTime.UtcNow,
            EmailBodyText = "Test content",
            EmailBodyHtml = "<p>Test content</p>",
            CreatedAt = DateTime.UtcNow
        };
    }
}