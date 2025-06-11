namespace ntlt.projectradar.backend.Common;

public interface IDelayService
{
    Task Delay(TimeSpan delay);
}

public class DelayService : IDelayService
{
    public async Task Delay(TimeSpan delay)
    {
        await Task.Delay(delay);
    }
}