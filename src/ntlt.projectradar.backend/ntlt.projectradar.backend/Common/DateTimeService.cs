namespace ntlt.projectradar.backend.Common;

public interface IDateTimeService
{
    DateTime Now { get; }
    DateTimeOffset NowOffset { get; }
}

public class DateTimeService : IDateTimeService
{
    public DateTime Now => DateTime.Now;
    public DateTimeOffset NowOffset => DateTimeOffset.Now;
}