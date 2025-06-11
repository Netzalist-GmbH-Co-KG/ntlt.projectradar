using System.Collections.Immutable;

namespace ntlt.projectradar.backend.Services.AI;

public class OpenAIChatCompletion : IChatCompletion
{
    public async Task<string> GetCompletionAsync(IImmutableList<ChatMessage> messages, CancellationToken cancellationToken = default)
    {
        // Extract the required data as a JSON string using function calling as specified here:
        // https://www.nuget.org/packages/OpenAI/2.2.0-beta.4#how-to-use-chat-completions-with-tools-and-function-calling
        return "";
    }
}