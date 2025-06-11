using Microsoft.Extensions.Logging;
using ntlt.projectradar.backend.Services.AI;
using System.Collections.Immutable;

namespace ntlt.projectradar.backend.tests.Services.AI;

/// <summary>
/// Integration test for OpenAI Function Calling - TEMPORARY for manual testing
/// This will be removed later once the feature is stable
/// </summary>
public class OpenAIChatCompletionIntegrationTests
{
    private readonly OpenAIChatCompletion _chatCompletion;
    private readonly ILogger<OpenAIChatCompletion> _logger;

    public OpenAIChatCompletionIntegrationTests()
    {
        _logger = Substitute.For<ILogger<OpenAIChatCompletion>>();
        _chatCompletion = new OpenAIChatCompletion(_logger);
    }

    [Test]
    public async Task ExtractProjectData_WithRealEmail_ShouldReturnStructuredData()
    {
        // Arrange
        var testEmailPath = Path.Combine(Directory.GetCurrentDirectory(), "Services", "AI", "test-email.txt");
        var emailContent = await File.ReadAllTextAsync(testEmailPath);

        var messages = new List<ChatMessage>
        {
            new ChatMessage(ChatMessageRole.System, SystemPrompts.DefaultSystemPrompt),
            new ChatMessage(ChatMessageRole.User, emailContent)
        }.ToImmutableList();

        // Act
        var result = await _chatCompletion.GetCompletionAsync(messages);

        // Assert
        Assert.NotNull(result);
        
        // Log the results for manual inspection
        _logger.LogInformation("=== EXTRACTION RESULTS ===");
        _logger.LogInformation($"Title: {result.Title}");
        _logger.LogInformation($"Description: {result.Description}");
        _logger.LogInformation($"Client: {result.ClientName}");
        _logger.LogInformation($"Contact: {result.ContactEmail}");
        _logger.LogInformation($"Budget Min: {result.BudgetMin}");
        _logger.LogInformation($"Budget Max: {result.BudgetMax}");
        _logger.LogInformation($"Timeline: {result.Timeline}");
        _logger.LogInformation($"Technologies: {string.Join(", ", result.Technologies)}");
        _logger.LogInformation($"Created At: {result.CreatedAt}");
        _logger.LogInformation("=== END RESULTS ===");

        // Basic assertions to ensure extraction worked
        Assert.True(!string.IsNullOrEmpty(result.Title), "Title should be extracted");
        Assert.True(result.Technologies.Count > 0, "Technologies should be extracted");
        Assert.True(result.BudgetMin.HasValue || result.BudgetMax.HasValue, "Some budget information should be extracted");
    }
}
