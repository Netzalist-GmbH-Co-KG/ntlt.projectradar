namespace ntlt.projectradar.backend.BackgroundServices;

public interface IEmailProcessingBackgroundService : IDisposable
{
    Task StartAsync(CancellationToken cancellationToken);
    Task StopAsync(CancellationToken cancellationToken);
    Task? ExecuteTask { get; }
    void StartProcessing();
    Task ProcessEmailsAsync(CancellationToken cancellationToken = default);
}