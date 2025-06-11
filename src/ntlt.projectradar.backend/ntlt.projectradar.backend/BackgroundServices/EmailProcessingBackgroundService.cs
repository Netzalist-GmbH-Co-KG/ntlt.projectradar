using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Services;

namespace ntlt.projectradar.backend.BackgroundServices;

public class EmailProcessingBackgroundService : BackgroundService, IEmailProcessingBackgroundService
{
    private readonly IEmailParserService _parserService;
    private readonly IDelayService _delayService;
    private readonly ILogger<EmailProcessingBackgroundService> _logger;
    private readonly AutoResetEvent _event = new(false);

    public EmailProcessingBackgroundService(IEmailParserService parserService, IDelayService delayService, ILogger<EmailProcessingBackgroundService> logger)
    {
        _parserService = parserService;
        _delayService = delayService;
        _logger = logger;
    }
    
    public void StartProcessing()
    {
        _event.Set();
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(async () =>
        {
            try
            {
                while (!stoppingToken.IsCancellationRequested) _event.WaitOne();
                _logger.LogInformation("Email processing background service started");
                await ProcessEmailsAsync(stoppingToken);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                await _delayService.Delay(TimeSpan.FromSeconds(5));
            }
        }, stoppingToken);
    }
    
    public async Task ProcessEmailsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting email processing");
             
            // Implement logic here
            
            _logger.LogInformation("Email processing completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while processing emails");
        }
    }
    
    public override void Dispose()
    {
        _event.Dispose();
        base.Dispose();
    }
}