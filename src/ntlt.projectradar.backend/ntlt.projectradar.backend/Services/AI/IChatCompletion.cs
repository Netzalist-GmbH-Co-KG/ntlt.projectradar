using System.Collections.Immutable;

namespace ntlt.projectradar.backend.Services.AI;

public interface IChatCompletion
{
    public Task<string> GetCompletionAsync(IImmutableList<ChatMessage> messages, CancellationToken cancellationToken = default);
}