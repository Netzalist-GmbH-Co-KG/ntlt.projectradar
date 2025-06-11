/**
 * EmailDetailHeader Component - Email Header Section
 */

'use client';

import { EmailDetailsDto } from '../../services/apiService';
import { 
  extractSenderName, 
  formatEmailDate, 
  extractEmailAddress,
  hasHtmlContent,
  hasTextContent
} from '../../services/emailUtils';
import EmailDetailAttachments from './EmailDetailAttachments';

interface EmailDetailHeaderProps {
  emailDetails: EmailDetailsDto;
  showHtml: boolean;
  onToggleView: (showHtml: boolean) => void;
  onAttachmentDownload: (attachmentId: string, filename: string) => void;
  isDownloading: string | null;
  downloadError: string | null;
}

export default function EmailDetailHeader({ 
  emailDetails, 
  showHtml, 
  onToggleView, 
  onAttachmentDownload, 
  isDownloading, 
  downloadError 
}: EmailDetailHeaderProps) {
  const hasHtml = hasHtmlContent(emailDetails);
  const hasText = hasTextContent(emailDetails);

  return (
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
                onClick={() => onToggleView(true)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  showHtml 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => onToggleView(false)}
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
        <EmailDetailAttachments
          attachments={emailDetails.attachments}
          onDownload={onAttachmentDownload}
          isDownloading={isDownloading}
          error={downloadError}
        />
      </div>
    </div>
  );
}
