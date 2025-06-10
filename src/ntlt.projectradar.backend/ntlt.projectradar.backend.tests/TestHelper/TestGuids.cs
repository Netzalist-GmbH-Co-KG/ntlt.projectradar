namespace ntlt.projectradar.backend.tests.TestHelper;

public static class TestGuids
{
    // Predefined GUIDs for consistent testing
    public static readonly Guid TestId1 = new("11111111-1111-1111-1111-111111111111");
    public static readonly Guid TestId2 = new("22222222-2222-2222-2222-222222222222");
    public static readonly Guid TestId3 = new("33333333-3333-3333-3333-333333333333");
    public static readonly Guid TestId4 = new("44444444-4444-4444-4444-444444444444");
    public static readonly Guid TestId5 = new("55555555-5555-5555-5555-555555555555");
    
    public static readonly Guid NonExistingId = new("99999999-9999-9999-9999-999999999999");
    
    // For database naming in tests
    public static readonly Guid DatabaseId1 = new("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    public static readonly Guid DatabaseId2 = new("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    public static readonly Guid DatabaseId3 = new("cccccccc-cccc-cccc-cccc-cccccccccccc");
}
