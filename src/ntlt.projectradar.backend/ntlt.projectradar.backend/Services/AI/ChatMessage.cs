namespace ntlt.projectradar.backend.Services.AI;

public record ChatMessage(ChatMessageRole Role, string Content);

public enum ChatMessageRole
{
    System,
    User,
    Assistant,
    Tool
}