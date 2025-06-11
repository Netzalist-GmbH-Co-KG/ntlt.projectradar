/**
 * Email Detail Component - Vollständige Email-Anzeige mit HTML/Text Toggle
 */

'use client';

import { useState } from 'react';
import { EmailListDto } from '../../services/apiService';
import { useEmailDetails, useAttachmentDownload } from '../../hooks/useEmails';
import { 
  extractSenderName, 
  formatEmailDate, 
  extractEmailAddress,
  hasHtmlContent,
  hasTextContent,
  getPreferredContent,
  sanitizeHtmlContent
} from '../../services/emailUtils';

interface EmailDetailProps {
  selectedEmail: EmailListDto | null;
}

export default function EmailDetail({ selectedEmail }: EmailDetailProps) {
  const [showHtml, setShowHtml] = useState(true);
  
  const { 
    email: emailDetails, 
    isLoading, 
    error 
  } = useEmailDetails(selectedEmail?.id || null);

  const { 
    downloadAttachment, 
    isDownloading, 
    error: downloadError 
  } = useAttachmentDownload();

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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">E-Mail wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Fehler beim Laden
          </h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <p className="text-neutral-600 text-sm">
            Die E-Mail-Details konnten nicht geladen werden.
          </p>
        </div>
      </div>
    );
  }

  if (!emailDetails) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            E-Mail nicht gefunden
          </h3>
          <p className="text-neutral-600">
            Die E-Mail-Details sind nicht verfügbar.
          </p>
        </div>
      </div>
    );
  }

  const hasHtml = hasHtmlContent(emailDetails);
  const hasText = hasTextContent(emailDetails);
  const { content, isHtml } = getPreferredContent(emailDetails, showHtml);
  const handleAttachmentDownload = async (attachmentId: string, filename: string) => {
    try {
      await downloadAttachment(attachmentId, filename);
    } catch (error) {
      console.error('Download failed:', error);
      // Error handling is managed by the hook
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Email Header */}
      <div className="border-b border-neutral-200 p-6 bg-white flex-shrink-0">
        <div className="space-y-4">
          {/* Subject */}
          <h2 className="text-xl font-semibold text-neutral-900">
            {emailDetails.emailSubject || '(Kein Betreff)'}
          </h2>
          
          {/* From/To/Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 w-16">Von:</span>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-900">{extractSenderName(emailDetails.emailFrom)}</span>
                <span className="text-xs text-neutral-500">{extractEmailAddress(emailDetails.emailFrom)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 w-16">An:</span>
              <span className="text-sm text-neutral-900">{emailDetails.emailTo}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 w-16">Datum:</span>
              <span className="text-sm text-neutral-900">
                {formatEmailDate(emailDetails.emailDate, 'absolute')}
              </span>
            </div>
          </div>

          {/* Content Toggle */}
          {(hasHtml && hasText) && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm font-medium text-neutral-700">Ansicht:</span>
              <div className="flex bg-neutral-100 rounded-md p-1">
                <button
                  onClick={() => setShowHtml(true)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    showHtml 
                      ? 'bg-white text-neutral-900 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setShowHtml(false)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    !showHtml 
                      ? 'bg-white text-neutral-900 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Text
                </button>
              </div>
            </div>
          )}

          {/* Attachments */}
          {emailDetails.attachments && emailDetails.attachments.length > 0 && (
            <div className="pt-2">
              <span className="text-sm font-medium text-neutral-700 mb-2 block">
                Anhänge ({emailDetails.attachments.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {emailDetails.attachments.map((attachment) => (                  <button
                    key={attachment.id}
                    onClick={() => handleAttachmentDownload(attachment.id, attachment.attachmentFilename)}
                    disabled={isDownloading === attachment.id}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm text-neutral-700 transition-colors"
                  >
                    {isDownloading === attachment.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-600"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="truncate max-w-[200px]">{attachment.attachmentFilename}</span>                    <span className="text-xs text-neutral-500">
                      ({attachment.attachmentMimeType})
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Download Error */}
              {downloadError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{downloadError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>      {/* Email Content */}
      <div className="flex-1 email-detail-content bg-neutral-50">
        <div className="h-full p-6">
          <div className="bg-white rounded-lg border border-neutral-200 h-full flex flex-col">
            {content ? (
              <div className="flex-1 p-6 overflow-auto email-content-container">
                {isHtml ? (
                  // HTML Content Rendering
                  <div className="prose prose-neutral max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: sanitizeHtmlContent(content) 
                      }}
                      className="email-html-content"
                    />
                  </div>
                ) : (
                  // Plain Text Content Rendering
                  <div className="whitespace-pre-wrap font-mono text-sm text-neutral-900 leading-relaxed">
                    {content}
                  </div>
                )}
              </div>            ) : (
              // No Content Available
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Kein Inhalt verfügbar
                  </h3>
                  <p className="text-neutral-600">
                    Diese E-Mail enthält keinen lesbaren Inhalt.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
