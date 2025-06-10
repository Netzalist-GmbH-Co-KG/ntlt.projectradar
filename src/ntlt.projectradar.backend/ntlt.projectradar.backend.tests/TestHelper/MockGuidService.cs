using System.Collections.Immutable;
using ntlt.projectradar.backend.Common;

namespace ntlt.projectradar.backend.tests.TestHelper;

public class MockGuidService : IGuidService
{
    private int _index = 0;
    private IImmutableList<Guid> _guids;

    public MockGuidService(IList<Guid> guids)
    {
        if (guids == null || !guids.Any())
            throw new ArgumentException("At least one GUID must be provided", nameof(guids));

        _guids = guids.ToImmutableList();
    }
    
    public Guid NewGuid()
    {
        var guid = _guids[_index];
        _index = (_index + 1) % _guids.Count;
        return guid;
    }
}