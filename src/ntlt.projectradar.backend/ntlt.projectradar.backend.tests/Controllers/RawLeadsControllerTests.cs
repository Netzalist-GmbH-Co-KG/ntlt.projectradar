using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ntlt.projectradar.backend.Controllers;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;
using System.Text;
using ntlt.projectradar.backend.tests.TestHelper;

namespace ntlt.projectradar.backend.tests.Controllers;

[TestFixture]
public class RawLeadsControllerTests
{
    private IRawLeadService _rawLeadService = null!;
    private ILogger<RawLeadsController> _logger = null!;
    private RawLeadsController _controller = null!;

    [SetUp]
    public void Setup()
    {
        _rawLeadService = Substitute.For<IRawLeadService>();
        _logger = Substitute.For<ILogger<RawLeadsController>>();
        _controller = new RawLeadsController(_rawLeadService, _logger);
    }

    #region UploadEmlFile Tests

    [Test]
    public async Task UploadEmlFile_WithValidEmlFile_ShouldReturnCreated()
    {
        // Arrange
        const string emlContent = "From: test@example.com\nSubject: Test Project\n\nProject details here...";
        var file = CreateMockFormFile("test.eml", emlContent);
          var expectedRawLead = new RawLead
        {
            Id = TestGuids.TestId1,
            OriginalContent = emlContent,
            UploadedAt = DateTime.UtcNow,
            ProcessingStatus = ProcessingStatus.New
        };

        _rawLeadService.CreateRawLeadAsync(emlContent, Arg.Any<CancellationToken>())
            .Returns(expectedRawLead);

        // Act
        var result = await _controller.UploadEmlFile(file);

        // Assert
        Assert.That(result.Result, Is.TypeOf<CreatedAtActionResult>());
        var createdResult = (CreatedAtActionResult)result.Result!;
        Assert.That(createdResult.Value, Is.EqualTo(expectedRawLead));
        Assert.That(createdResult.ActionName, Is.EqualTo(nameof(_controller.GetRawLead)));
        
        await _rawLeadService.Received(1).CreateRawLeadAsync(emlContent, Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task UploadEmlFile_WithNullFile_ShouldReturnBadRequest()
    {
        // Act
        var result = await _controller.UploadEmlFile(null!);

        // Assert
        Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
        var badRequestResult = (BadRequestObjectResult)result.Result!;
        Assert.That(badRequestResult.Value, Is.Not.Null);
        
        await _rawLeadService.DidNotReceive().CreateRawLeadAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task UploadEmlFile_WithEmptyFile_ShouldReturnBadRequest()
    {
        // Arrange
        var file = CreateMockFormFile("test.eml", "", 0);

        // Act
        var result = await _controller.UploadEmlFile(file);

        // Assert
        Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
        await _rawLeadService.DidNotReceive().CreateRawLeadAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task UploadEmlFile_WithInvalidExtension_ShouldReturnBadRequest()
    {
        // Arrange
        var file = CreateMockFormFile("test.txt", "Some content");

        // Act
        var result = await _controller.UploadEmlFile(file);

        // Assert
        Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
        var badRequestResult = (BadRequestObjectResult)result.Result!;
        var errorResponse = badRequestResult.Value;
        Assert.That(errorResponse!.ToString(), Does.Contain("Only .eml files are allowed"));
        
        await _rawLeadService.DidNotReceive().CreateRawLeadAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task UploadEmlFile_WithTooLargeFile_ShouldReturnBadRequest()
    {
        // Arrange - Create a file larger than 10MB
        const long maxFileSize = 10 * 1024 * 1024 + 1; // 10MB + 1 byte
        var largeContent = new string('A', (int)maxFileSize);
        var file = CreateMockFormFile("test.eml", largeContent, maxFileSize);

        // Act
        var result = await _controller.UploadEmlFile(file);

        // Assert
        Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
        var badRequestResult = (BadRequestObjectResult)result.Result!;
        var errorResponse = badRequestResult.Value;
        Assert.That(errorResponse!.ToString(), Does.Contain("File size exceeds 10MB limit"));
        
        await _rawLeadService.DidNotReceive().CreateRawLeadAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task UploadEmlFile_WithInvalidEmlContent_ShouldReturnBadRequest()
    {
        // Arrange - Content without email headers
        const string invalidContent = "Just some random text without email headers";
        var file = CreateMockFormFile("test.eml", invalidContent);

        // Act
        var result = await _controller.UploadEmlFile(file);

        // Assert
        Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
        var badRequestResult = (BadRequestObjectResult)result.Result!;
        var errorResponse = badRequestResult.Value;
        Assert.That(errorResponse!.ToString(), Does.Contain("Invalid .eml file - missing email headers"));
        
        await _rawLeadService.DidNotReceive().CreateRawLeadAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task UploadEmlFile_WhenServiceThrowsException_ShouldReturnInternalServerError()
    {
        // Arrange
        const string emlContent = "From: test@example.com\nSubject: Test\n\nContent";
        var file = CreateMockFormFile("test.eml", emlContent);        _rawLeadService.CreateRawLeadAsync(emlContent, Arg.Any<CancellationToken>())
            .Returns(Task.FromException<RawLead>(new InvalidOperationException("Database error")));

        // Act
        var result = await _controller.UploadEmlFile(file);

        // Assert
        Assert.That(result.Result, Is.TypeOf<ObjectResult>());
        var objectResult = (ObjectResult)result.Result!;
        Assert.That(objectResult.StatusCode, Is.EqualTo(500));
    }

    #endregion

    #region GetRawLead Tests    
    
    [Test]
    public async Task GetRawLead_WithExistingId_ShouldReturnOk()
    {
        // Arrange
        var rawLeadId = TestGuids.TestId1;
        var expectedRawLead = new RawLead
        {
            Id = rawLeadId,
            OriginalContent = "Test content",
            UploadedAt = DateTime.UtcNow,
            ProcessingStatus = ProcessingStatus.New
        };

        _rawLeadService.GetRawLeadByIdAsync(rawLeadId, Arg.Any<CancellationToken>())
            .Returns(expectedRawLead);

        // Act
        var result = await _controller.GetRawLead(rawLeadId);

        // Assert
        Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
        var okResult = (OkObjectResult)result.Result!;
        Assert.That(okResult.Value, Is.EqualTo(expectedRawLead));
    }    
    
    [Test]
    public async Task GetRawLead_WithNonExistingId_ShouldReturnNotFound()
    {
        // Arrange
        var nonExistingId = TestGuids.NonExistingId;
        _rawLeadService.GetRawLeadByIdAsync(nonExistingId, Arg.Any<CancellationToken>())
            .Returns((RawLead?)null);

        // Act
        var result = await _controller.GetRawLead(nonExistingId);

        // Assert
        Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
    }

    #endregion

    #region GetRawLeads Tests

    [Test]
    public async Task GetRawLeads_WithoutStatusFilter_ShouldReturnAllRawLeads()
    {
        // Arrange
        var expectedRawLeads = new List<RawLead>
        {
            new() { Id = TestGuids.TestId1, OriginalContent = "Content 1", UploadedAt = DateTime.UtcNow, ProcessingStatus = ProcessingStatus.New },
            new() { Id = TestGuids.TestId2, OriginalContent = "Content 2", UploadedAt = DateTime.UtcNow, ProcessingStatus = ProcessingStatus.Processing }
        };

        _rawLeadService.GetRawLeadsAsync(null, Arg.Any<CancellationToken>())
            .Returns(expectedRawLeads);

        // Act
        var result = await _controller.GetRawLeads();

        // Assert
        Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
        var okResult = (OkObjectResult)result.Result!;
        Assert.That(okResult.Value, Is.EqualTo(expectedRawLeads));
    }

    [Test]
    public async Task GetRawLeads_WithStatusFilter_ShouldReturnFilteredRawLeads()
    {
        // Arrange
        var status = ProcessingStatus.Completed;
        var expectedRawLeads = new List<RawLead>
        {
            new() { Id = TestGuids.TestId1, OriginalContent = "Completed Content", UploadedAt = DateTime.UtcNow, ProcessingStatus = ProcessingStatus.Completed }
        };

        _rawLeadService.GetRawLeadsAsync(status, Arg.Any<CancellationToken>())
            .Returns(expectedRawLeads);

        // Act
        var result = await _controller.GetRawLeads(status);

        // Assert
        Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
        var okResult = (OkObjectResult)result.Result!;
        Assert.That(okResult.Value, Is.EqualTo(expectedRawLeads));
        
        await _rawLeadService.Received(1).GetRawLeadsAsync(status, Arg.Any<CancellationToken>());
    }

    #endregion

    #region UpdateProcessingStatus Tests

    [Test]
    public async Task UpdateProcessingStatus_WithExistingId_ShouldReturnNoContent()
    {        // Arrange
        var rawLeadId = TestGuids.TestId1;
        var request = new UpdateStatusRequest { Status = ProcessingStatus.Completed };

        _rawLeadService.UpdateProcessingStatusAsync(rawLeadId, request.Status, Arg.Any<CancellationToken>())
            .Returns(true);

        // Act
        var result = await _controller.UpdateProcessingStatus(rawLeadId, request);

        // Assert
        Assert.That(result, Is.TypeOf<NoContentResult>());
        await _rawLeadService.Received(1).UpdateProcessingStatusAsync(rawLeadId, request.Status, Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task UpdateProcessingStatus_WithNonExistingId_ShouldReturnNotFound()
    {        // Arrange
        var nonExistingId = TestGuids.NonExistingId;
        var request = new UpdateStatusRequest { Status = ProcessingStatus.Completed };

        _rawLeadService.UpdateProcessingStatusAsync(nonExistingId, request.Status, Arg.Any<CancellationToken>())
            .Returns(false);

        // Act
        var result = await _controller.UpdateProcessingStatus(nonExistingId, request);

        // Assert
        Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
    }

    #endregion

    #region DeleteRawLead Tests

    [Test]
    public async Task DeleteRawLead_WithExistingId_ShouldReturnNoContent()
    {
        // Arrange
        var rawLeadId = TestGuids.TestId1;
        _rawLeadService.DeleteRawLeadAsync(rawLeadId, Arg.Any<CancellationToken>())
            .Returns(true);

        // Act
        var result = await _controller.DeleteRawLead(rawLeadId);

        // Assert
        Assert.That(result, Is.TypeOf<NoContentResult>());
        await _rawLeadService.Received(1).DeleteRawLeadAsync(rawLeadId, Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task DeleteRawLead_WithNonExistingId_ShouldReturnNotFound()
    {
        // Arrange
        var nonExistingId = TestGuids.NonExistingId;
        _rawLeadService.DeleteRawLeadAsync(nonExistingId, Arg.Any<CancellationToken>())
            .Returns(false);

        // Act
        var result = await _controller.DeleteRawLead(nonExistingId);

        // Assert
        Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
    }

    #endregion

    #region Helper Methods

    private static IFormFile CreateMockFormFile(string fileName, string content, long? fileSize = null)
    {
        var bytes = Encoding.UTF8.GetBytes(content);
        var stream = new MemoryStream(bytes);
        
        var formFile = Substitute.For<IFormFile>();
        formFile.FileName.Returns(fileName);
        formFile.Length.Returns(fileSize ?? bytes.Length);
        formFile.OpenReadStream().Returns(stream);
        
        return formFile;
    }

    #endregion
}
