using System.Collections.Immutable;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services.AI;

public interface IChatCompletion
{
    public Task<ProjectDetails?> GetCompletionAsync(IImmutableList<ChatMessage> messages,
        CancellationToken cancellationToken = default);
}