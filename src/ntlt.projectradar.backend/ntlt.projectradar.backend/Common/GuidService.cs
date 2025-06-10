namespace ntlt.projectradar.backend.Common;

public class GuidService : IGuidService
{
    public Guid NewGuid()
    {
        return Guid.NewGuid();
    }
}

public interface IGuidService
{
    Guid NewGuid();
}