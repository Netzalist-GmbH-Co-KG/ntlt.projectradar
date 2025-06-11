using System.Collections.Immutable;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services.AI;

public class DataExtractionService : IDataExtractionService
{
    private readonly IChatCompletion _completion;
    private readonly ILogger<DataExtractionService> _logger;

    public DataExtractionService(IChatCompletion completion, ILogger<DataExtractionService> logger)
    {
        _logger = logger;
        _completion = completion;
    }

    public async Task<ProjectDetails?> Extract(string rawData, CancellationToken cancellationToken = default)
    {
        try
        {
            var messages = new List<ChatMessage>
            {
                new(ChatMessageRole.System, SystemPrompts.DefaultSystemPrompt),
                new(ChatMessageRole.User, rawData)
            }.ToImmutableList();

            var result = await _completion.GetCompletionAsync(messages, cancellationToken);
            return result;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error extracting data from raw content");
            return null;
        }
    }
}