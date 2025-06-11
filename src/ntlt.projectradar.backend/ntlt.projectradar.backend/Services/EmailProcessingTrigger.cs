using ntlt.projectradar.backend.BackgroundServices;

namespace ntlt.projectradar.backend.Services;

public class EmailProcessingTrigger : IEmailProcessingTrigger
{
    private readonly ILogger<EmailProcessingTrigger> _logger;
    public event EventHandler? OnProcessingTriggered;

    public EmailProcessingTrigger(ILogger<EmailProcessingTrigger> logger)
    {
        _logger = logger;
    }

    public void TriggerProcessing()
    {
        _logger.LogDebug("Email processing trigger called");
        OnProcessingTriggered?.Invoke(this, EventArgs.Empty);
    }
}
