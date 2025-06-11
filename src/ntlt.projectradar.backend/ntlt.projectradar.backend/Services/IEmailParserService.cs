using ntlt.projectradar.backend.Models;

namespace ntlt.projectradar.backend.Services;

public interface IEmailParserService
{
    /// <summary>
    /// Parses a RawLead's email content and persists the extracted data to EmailDetails and EmailAttachment tables.
    /// If EmailDetails already exist for this RawLead, they will be deleted and recreated (deduplication).
    /// </summary>
    /// <param name="rawLead">The RawLead containing the email content to parse</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The created EmailDetails entity</returns>
    Task<EmailDetails> ParseAndPersistEmailAsync(RawLead rawLead, CancellationToken cancellationToken = default);
}
