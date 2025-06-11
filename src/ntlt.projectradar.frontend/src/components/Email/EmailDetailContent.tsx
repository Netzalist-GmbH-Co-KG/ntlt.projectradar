/**
 * EmailDetailContent Component - Email Content Rendering
 */

'use client';

import { 
  getPreferredContent,
  sanitizeHtmlContent
} from '../../services/emailUtils';
import { EmailDetailsDto } from '../../services/apiService';

interface EmailDetailContentProps {
  emailDetails: EmailDetailsDto;
  showHtml: boolean;
  onToggleView: (showHtml: boolean) => void;
}

export default function EmailDetailContent({ 
  emailDetails, 
  showHtml
}: EmailDetailContentProps) {
  const { content, isHtml } = getPreferredContent(emailDetails, showHtml);

  return (
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
            </div>
          ) : (
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
  );
}
