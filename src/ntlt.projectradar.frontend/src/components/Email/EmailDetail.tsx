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
  const [previousEmailDetails, setPreviousEmailDetails] = useState<any>(null);
  
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

  // Keep track of previous email details to prevent layout shifts during loading
  const displayEmailDetails = emailDetails || (isLoading && previousEmailDetails ? previousEmailDetails : null);
  
  // Update previous email details when we get new data
  if (emailDetails && (!previousEmailDetails || previousEmailDetails.id !== emailDetails.id)) {
    setPreviousEmailDetails(emailDetails);
  }

  const handleAttachmentDownload = async (attachmentId: string, filename: string) => {
    try {
      await downloadAttachment(attachmentId, filename);
    } catch (error) {
      console.error('Download failed:', error);
      // Error handling is managed by the hook
    }
  };  // Handle different states with layout stability
  if (!selectedEmail) {
    return <EmailDetailMissing type="no-selection" />;
  }

  if (error && !displayEmailDetails) {
    return <EmailDetailError error={error} />;
  }

  if (!displayEmailDetails && isLoading) {
    return <EmailDetailMissing type="loading" />;
  }

  if (!displayEmailDetails) {
    return <EmailDetailMissing type="not-found" />;
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Show loading overlay if loading new email but keep previous content */}
      {isLoading && emailDetails !== displayEmailDetails && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Email Header */}
      <EmailDetailHeader 
        emailDetails={displayEmailDetails}
        showHtml={showHtml}
        onToggleView={setShowHtml}
        onAttachmentDownload={handleAttachmentDownload}
        isDownloading={isDownloading}
        downloadError={downloadError}
      />
      
      {/* Email Content */}
      <EmailDetailContent 
        emailDetails={displayEmailDetails}
        showHtml={showHtml}
        onToggleView={setShowHtml}
      />
    </div>
  );
}
