namespace ntlt.projectradar.backend.BackgroundServices;

public interface IEmailProcessingBackgroundService : IDisposable
{
    Task? ExecuteTask { get; }
    Task StartAsync(CancellationToken cancellationToken);
    Task StopAsync(CancellationToken cancellationToken);
    void StartProcessing();
    Task ProcessEmailsAsync(CancellationToken cancellationToken = default);
}