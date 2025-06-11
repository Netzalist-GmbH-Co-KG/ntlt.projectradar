/**
 * EmailDetailAttachments Component - Attachments Section for EmailDetail
 */

'use client';

import { EmailAttachmentDto } from '../../services/apiService';

interface EmailDetailAttachmentsProps {
  attachments: EmailAttachmentDto[];
  onDownload: (attachmentId: string, filename: string) => void;
  isDownloading: string | null;
  error: string | null;
}

export default function EmailDetailAttachments({ 
  attachments, 
  onDownload, 
  isDownloading, 
  error 
}: EmailDetailAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="pt-2">
      <span className="text-sm font-medium text-neutral-700 mb-2 block">
        Anhänge ({attachments.length}):
      </span>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <button
            key={attachment.id}
            onClick={() => onDownload(attachment.id, attachment.attachmentFilename)}
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
            <span className="truncate max-w-[200px]">{attachment.attachmentFilename}</span>
            <span className="text-xs text-neutral-500">
              ({attachment.attachmentMimeType})
            </span>
          </button>
        ))}
      </div>
      
      {/* Download Error */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
