/**
 * Email Detail Placeholder Component
 */

'use client';

import { EmailListDto } from '../../services/apiService';
import { extractSenderName, formatEmailDate, extractEmailAddress } from '../../services/emailUtils';

interface EmailDetailPlaceholderProps {
  selectedEmail: EmailListDto | null;
}

export default function EmailDetailPlaceholder({ selectedEmail }: EmailDetailPlaceholderProps) {
  if (!selectedEmail) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Keine E-Mail ausgewählt
          </h3>
          <p className="text-neutral-600">
            Wählen Sie eine E-Mail aus der Liste aus, um die Details anzuzeigen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Email Header */}
      <div className="border-b border-neutral-200 p-6 bg-white">
        <div className="space-y-4">
          {/* Subject */}
          <h2 className="text-xl font-semibold text-neutral-900">
            {selectedEmail.emailSubject || '(Kein Betreff)'}
          </h2>
          
          {/* From/To/Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 w-16">Von:</span>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-900">{extractSenderName(selectedEmail.emailFrom)}</span>
                <span className="text-xs text-neutral-500">{extractEmailAddress(selectedEmail.emailFrom)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 w-16">An:</span>
              <span className="text-sm text-neutral-900">{selectedEmail.emailTo}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 w-16">Datum:</span>
              <span className="text-sm text-neutral-900">
                {formatEmailDate(selectedEmail.emailDate, 'absolute')}
              </span>
            </div>
          </div>

          {/* Attachments */}
          {selectedEmail.hasAttachments && selectedEmail.attachments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 w-16">Anhänge:</span>
              <div className="flex flex-wrap gap-2">
                {selectedEmail.attachments.map((attachment) => (
                  <span
                    key={attachment.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-md text-xs text-neutral-700"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {attachment.attachmentFilename}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Content Placeholder */}
      <div className="flex-1 p-6 bg-neutral-50">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              E-Mail-Inhalt wird geladen...
            </h3>
            <p className="text-neutral-600 mb-4">
              Die detaillierte E-Mail-Ansicht wird in der nächsten Implementierungsphase verfügbar sein.
            </p>
            <div className="text-left bg-neutral-50 rounded-md p-4 text-sm text-neutral-600">
              <p><strong>Geplante Features:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>HTML/Text E-Mail-Rendering</li>
                <li>Attachment-Download</li>
                <li>Sichere HTML-Anzeige</li>
                <li>Mobile-responsive Design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
