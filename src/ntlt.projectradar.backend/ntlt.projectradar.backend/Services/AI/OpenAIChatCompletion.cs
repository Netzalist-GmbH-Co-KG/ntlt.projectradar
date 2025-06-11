using System.Collections.Immutable;
using System.Text;
using Newtonsoft.Json;
using OpenAI.Chat;
using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services.AI;

public class OpenAIChatCompletion : IChatCompletion
{
    private readonly ChatClient _chatClient;
    private readonly ILogger<OpenAIChatCompletion> _logger;

    public OpenAIChatCompletion(ILogger<OpenAIChatCompletion> logger)
    {
        _logger = logger;
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("OpenAI API Key not found. Please set it in configuration or environment variable OPENAI_API_KEY");
        }

        _chatClient = new ChatClient("gpt-4o", apiKey);
    }

    public async Task<ProjectDetails?> GetCompletionAsync(IImmutableList<ChatMessage> messages, CancellationToken cancellationToken = default)
    {
        try
        {
            // Convert our ChatMessage to OpenAI ChatMessage
            var openAiMessages = messages.Select(ConvertMessage).ToList();

            // Define the function tool for project data extraction
            var extractProjectDataTool = ChatTool.CreateFunctionTool(
                functionName: nameof(ExtractProjectData),
                functionDescription: "Extract structured project data from email content including title, description, client information, budget, timeline, and technologies",
                functionParameters: BinaryData.FromBytes("""
                    {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "The project title or job title"
                            },
                            "description": {
                                "type": "string", 
                                "description": "Detailed project description"
                            },
                            "clientName": {
                                "type": "string",
                                "description": "Name of the client or company (if mentioned)"
                            },
                            "agencyName": {
                                "type": "string",
                                "description": "Name of the agency (if applicable)"
                            },
                    
                            "contactEmail": {
                                "type": "string",
                                "description": "Contact email address"
                            },
                            "projectType": {
                                "type": "string",
                                "description": "Type of project (e.g., Web Development, Mobile App, E-Commerce)"
                            },
                            "budgetMin": {
                                "type": "number",
                                "description": "Minimum budget amount"
                            },
                            "budgetMax": {
                                "type": "number", 
                                "description": "Maximum budget amount"
                            },
                            "timeline": {
                                "type": "string",
                                "description": "Project timeline or duration"
                            },
                            "technologies": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "List of technologies, frameworks, or programming languages"
                            },
                            "location": {
                                "type": "string",
                                "description": "Project location"
                            },
                            "remotePossible": {
                                "type": "boolean",
                                "description": "Whether remote work is possible"
                            },
                            "sourceType": {
                                "type": "string",
                                "description": "Source type (e.g., email, agency, platform)"
                            }
                        },
                        "required": []
                    }
                    """u8.ToArray())
            );

            var options = new ChatCompletionOptions
            {
                Tools = { extractProjectDataTool }
            };

            var completion = await _chatClient.CompleteChatAsync(openAiMessages, options, cancellationToken);

            // Check if the model wants to call our function
            if (completion.Value.FinishReason == ChatFinishReason.ToolCalls && completion.Value.ToolCalls.Count > 0)
            {
                var toolCall = completion.Value.ToolCalls[0];
                
                if (toolCall.FunctionName == nameof(ExtractProjectData))
                {
                    // Convert binary data from UTF-8 encoding into string
                    var functionArguments = Encoding.UTF8.GetString(toolCall.FunctionArguments);
                    // Parse the function arguments (JSON) to our extraction schema
                    
                    var extractionResult = JsonConvert.DeserializeObject<ProjectExtractionSchema>(functionArguments);
                    
                    if (extractionResult != null)
                    {
                        // Map to ProjectDetails
                        return MapToProjectDetails(extractionResult);
                    }
                }
            }

            _logger.LogWarning("OpenAI did not call the extraction function or returned empty result");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during OpenAI function calling for project data extraction");
            return null;
        }
    }

    private static OpenAI.Chat.ChatMessage ConvertMessage(ChatMessage message)
    {
        return message.Role switch
        {
            ChatMessageRole.System => new SystemChatMessage(message.Content),
            ChatMessageRole.User => new UserChatMessage(message.Content),
            ChatMessageRole.Assistant => new AssistantChatMessage(message.Content),
            ChatMessageRole.Tool => new ToolChatMessage("", message.Content), // Tool messages need an ID
            _ => throw new ArgumentOutOfRangeException(nameof(message.Role))
        };
    }

    private static ProjectDetails MapToProjectDetails(ProjectExtractionSchema schema)
    {
        return new ProjectDetails
        {
            Id = Guid.NewGuid(),
            Title = schema.Title,
            Description = schema.Description,
            ClientName = schema.ClientName,
            AgencyName = schema.AgencyName,
            ContactEmail = schema.ContactEmail,
            BudgetMin = schema.BudgetMin,
            BudgetMax = schema.BudgetMax,
            Timeline = schema.Timeline,
            Technologies = schema.Technologies?.ToList() ?? new List<string>(),
            CreatedAt = DateTime.UtcNow
        };
    }

    // This method signature is required by the function calling, but implementation is not needed
    // as we handle the extraction logic directly in GetCompletionAsync
    private static string ExtractProjectData(ProjectExtractionSchema data)
    {
        return "Extracted successfully";
    }
}