/**
 * Email Detail Component - Vollständige Email-Anzeige mit HTML/Text Toggle
 * Refactored to use sub-components for better maintainability
 */

'use client';

import { useState } from 'react';
import { EmailListDto } from '../../services/apiService';
import { useEmailDetails, useAttachmentDownload } from '../../hooks/useEmails';
import EmailDetailError from './EmailDetailError';
import EmailDetailMissing from './EmailDetailMissing';
import EmailDetailHeader from './EmailDetailHeader';
import EmailDetailContent from './EmailDetailContent';

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

  const handleAttachmentDownload = async (attachmentId: string, filename: string) => {
    try {
      await downloadAttachment(attachmentId, filename);
    } catch (error) {
      console.error('Download failed:', error);
      // Error handling is managed by the hook
    }
  };

  // Handle different states
  if (!selectedEmail) {
    return <EmailDetailMissing type="no-selection" />;
  }

  if (isLoading) {
    return <EmailDetailMissing type="loading" />;
  }

  if (error) {
    return <EmailDetailError error={error} />;
  }

  if (!emailDetails) {
    return <EmailDetailMissing type="not-found" />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Email Header */}
      <EmailDetailHeader 
        emailDetails={emailDetails}
        showHtml={showHtml}
        onToggleView={setShowHtml}
        onAttachmentDownload={handleAttachmentDownload}
        isDownloading={isDownloading}
        downloadError={downloadError}
      />
      
      {/* Email Content */}
      <EmailDetailContent 
        emailDetails={emailDetails}
        showHtml={showHtml}
        onToggleView={setShowHtml}
      />
    </div>
  );
}
