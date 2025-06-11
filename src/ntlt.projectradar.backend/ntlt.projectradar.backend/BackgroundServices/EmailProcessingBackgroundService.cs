using ntlt.projectradar.backend.Common;
using ntlt.projectradar.backend.Models;
using ntlt.projectradar.backend.Services;

namespace ntlt.projectradar.backend.BackgroundServices;

public class EmailProcessingBackgroundService : BackgroundService, IEmailProcessingBackgroundService
{
    private readonly IEmailParserService _parserService;
    private readonly IRawLeadService _rawLeadService;
    private readonly IDelayService _delayService;
    private readonly ILogger<EmailProcessingBackgroundService> _logger;
    private readonly AutoResetEvent _event = new(false);
    private Task? _executeTask;

    public EmailProcessingBackgroundService(
        IEmailParserService parserService, 
        IRawLeadService rawLeadService,
        IDelayService delayService, 
        ILogger<EmailProcessingBackgroundService> logger)
    {
        _parserService = parserService;
        _rawLeadService = rawLeadService;
        _delayService = delayService;
        _logger = logger;
    }
    
    public new Task? ExecuteTask => _executeTask;
    
    public void StartProcessing()
    {
        _event.Set();
        _logger.LogDebug("Background service processing triggered");
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _executeTask = Task.Run(async () =>
        {
            _logger.LogInformation("Email processing background service started");
            
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Wait for signal or cancellation
                    _event.WaitOne();
                    
                    if (stoppingToken.IsCancellationRequested)
                        break;
                        
                    await ProcessEmailsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in background service execution loop");
                    await _delayService.Delay(TimeSpan.FromSeconds(5));
                }
            }
            
            _logger.LogInformation("Email processing background service stopped");
        }, stoppingToken);
        
        return _executeTask;
    }
    
    public async Task ProcessEmailsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting email processing batch");
            
            // Get all RawLeads with Processing status
            var processingRawLeads = await _rawLeadService.GetRawLeadsAsync(
                ProcessingStatus.Processing, cancellationToken);
            
            if (!processingRawLeads.Any())
            {
                _logger.LogDebug("No RawLeads with Processing status found");
                return;
            }
            
            _logger.LogInformation("Found {Count} RawLeads to process", processingRawLeads.Count);
            
            // Process each RawLead in parallel
            var processingTasks = processingRawLeads.Select(async rawLead =>
            {
                await ProcessSingleRawLeadAsync(rawLead, cancellationToken);
            });
            
            await Task.WhenAll(processingTasks);
            
            _logger.LogInformation("Email processing batch completed successfully. Processed {Count} RawLeads", 
                processingRawLeads.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while processing email batch");
        }
    }
    
    private async Task ProcessSingleRawLeadAsync(RawLead rawLead, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Processing RawLead {RawLeadId}", rawLead.Id);
            
            // Parse and persist email details
            await _parserService.ParseAndPersistEmailAsync(rawLead, cancellationToken);
            
            // Update status to Completed
            await _rawLeadService.UpdateProcessingStatusAsync(
                rawLead.Id, ProcessingStatus.Completed, cancellationToken);
            
            _logger.LogDebug("Successfully processed RawLead {RawLeadId}", rawLead.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process RawLead {RawLeadId}", rawLead.Id);
            
            try
            {
                // Update status to Failed
                await _rawLeadService.UpdateProcessingStatusAsync(
                    rawLead.Id, ProcessingStatus.Failed, cancellationToken);
            }
            catch (Exception updateEx)
            {
                _logger.LogError(updateEx, "Failed to update RawLead {RawLeadId} status to Failed", rawLead.Id);
            }
        }
    }
    
    public override void Dispose()
    {
        _event.Dispose();
        base.Dispose();
    }
}