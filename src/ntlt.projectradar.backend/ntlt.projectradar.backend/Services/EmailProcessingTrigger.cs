namespace ntlt.projectradar.backend.Services;

public class EmailProcessingTrigger : IEmailProcessingTrigger
{
    private readonly ILogger<EmailProcessingTrigger> _logger;

    public EmailProcessingTrigger(ILogger<EmailProcessingTrigger> logger)
    {
        _logger = logger;
    }

    public event EventHandler? OnProcessingTriggered;

    public void TriggerProcessing()
    {
        _logger.LogDebug("Email processing trigger called");
        OnProcessingTriggered?.Invoke(this, EventArgs.Empty);
    }
}