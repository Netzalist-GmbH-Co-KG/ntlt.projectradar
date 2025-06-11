namespace ntlt.projectradar.backend.Services;

public interface IEmailProcessingTrigger
{
    event EventHandler? OnProcessingTriggered;
    void TriggerProcessing();
}