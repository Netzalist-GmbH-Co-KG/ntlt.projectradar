/**
 * EmailsSplitView Component - Main layout for email management
 * Split layout: EmailList (left) + EmailDetail (right)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmails, useEmailDetails } from '../../hooks/useEmails';
import { EmailListDto } from '../../services/apiService';
import { Breadcrumb } from '../Navigation/Breadcrumb';
import EmailList from './EmailList';
import EmailDetail from './EmailDetail';
import EmailDetailMissing from './EmailDetailMissing';
import ResizableSplit from '../Layout/ResizableSplit';

interface EmailsSplitViewProps {
  selectedEmailId?: string;
  onEmailIdChange?: (emailId: string | undefined) => void;
}

export default function EmailsSplitView({ selectedEmailId, onEmailIdChange }: EmailsSplitViewProps) {
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<EmailListDto | null>(null);
  
  const {
    emails,
    totalCount,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading: emailsLoading,
    error: emailsError,
    refetch,
    loadNextPage,
    loadPreviousPage,
    goToPage
  } = useEmails({
    page: 1,
    pageSize: 100,
    autoRefresh: false
  });

  const breadcrumbItems = [
    { label: 'Emails', href: '/emails' }
  ];
  // Find and set selected email when emailId changes or emails load
  useEffect(() => {
    if (selectedEmailId && emails.length > 0) {
      const email = emails.find(e => e.id === selectedEmailId);
      if (email && (!selectedEmail || selectedEmail.id !== email.id)) {
        // Only update if we found a different email
        setSelectedEmail(email);
      } else if (!email && (!selectedEmail || selectedEmail.id !== selectedEmailId)) {
        // Email not found in current page, but we still want to show it's selected
        // The EmailDetail component will handle the loading/error states
        setSelectedEmail({ id: selectedEmailId } as EmailListDto);
      }
    } else if (!selectedEmailId && selectedEmail) {
      setSelectedEmail(null);
    }
  }, [selectedEmailId, emails]); // Removed selectedEmail from deps to prevent loops  // Handle email selection with smooth transitions
  const handleEmailSelect = (email: EmailListDto) => {
    // Optimistic update: set email immediately for smooth UX
    setSelectedEmail(email);
    
    // Notify parent component to update URL without page reload
    if (onEmailIdChange) {
      // Use setTimeout to ensure state update happens first
      setTimeout(() => {
        onEmailIdChange(email.id);
      }, 0);
    } else {
      // Fallback: use Next.js router if no callback provided
      router.push(`/emails/${email.id}`, { scroll: false });
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50" style={{ height: 'calc(100vh - 4rem - 3rem)' }}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-2xl font-semibold text-neutral-900 mt-2">
              Email-Client
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage and view all incoming email communications
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              {totalCount} E-Mail{totalCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={refetch}
              disabled={emailsLoading}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailsLoading ? 'Aktualisiere...' : 'Aktualisieren'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 min-h-0">
        <ResizableSplit 
          useFixedWidth={true}
          initialLeftWidth={400} 
          minLeftWidth={300} 
          maxLeftWidth={600}
        >
          {/* Email List - Left Panel */}
          <div className="bg-white flex flex-col h-full">
            {emailsError && (
              <div className="p-4 bg-red-50 border-b border-red-200 flex-shrink-0">
                <p className="text-sm text-red-600">{emailsError}</p>
              </div>
            )}
            
            <EmailList
              emails={emails}
              selectedEmail={selectedEmail}
              onEmailSelect={handleEmailSelect}
              isLoading={emailsLoading}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onLoadNextPage={loadNextPage}
              onLoadPreviousPage={loadPreviousPage}
              onGoToPage={goToPage}
            />
          </div>

          {/* Email Detail - Right Panel */}
          <div className="bg-white flex flex-col h-full">
            <EmailDetail selectedEmail={selectedEmail} />
          </div>
        </ResizableSplit>
      </div>
    </div>
  );
}
