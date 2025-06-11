using System.Collections.Immutable;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services.AI;

public class DataExtractor : IDataExtractor
{
    private readonly ILogger<DataExtractor> _logger;
    private readonly IChatCompletion _completion;

    public DataExtractor(IChatCompletion completion, ILogger<DataExtractor> logger)
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
                new ChatMessage(ChatMessageRole.System, SystemPrompts.DefaultSystemPrompt),
                new ChatMessage(ChatMessageRole.User, rawData)
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