/**
 * Email Client Page - Email List with Detail View
 */

'use client';

import { useState } from 'react';
import { useEmails } from '../../hooks/useEmails';
import EmailList from '../../components/Email/EmailList';
import EmailDetail from '../../components/Email/EmailDetail';
import { EmailListDto } from '../../services/apiService';

export default function EmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState<EmailListDto | null>(null);
  
  const {
    emails,
    totalCount,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    error,
    refetch,
    loadNextPage,
    loadPreviousPage,
    goToPage
  } = useEmails({
    page: 1,
    pageSize: 100,
    autoRefresh: false
  });

  const handleEmailSelect = (email: EmailListDto) => {
    setSelectedEmail(email);
  };  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Email-Client
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              {totalCount} E-Mails
            </span>
            <button
              onClick={refetch}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Aktualisiere...' : 'Aktualisieren'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Email Client Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Email List - Left Panel */}
        <div className="w-1/3 border-r border-neutral-200 bg-white flex flex-col">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200 flex-shrink-0">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <EmailList
            emails={emails}
            selectedEmail={selectedEmail}
            onEmailSelect={handleEmailSelect}
            isLoading={isLoading}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onLoadNextPage={loadNextPage}
            onLoadPreviousPage={loadPreviousPage}
            onGoToPage={goToPage}
          />
        </div>        {/* Email Detail - Right Panel */}
        <div className="flex-1 bg-white min-w-0">
          <EmailDetail selectedEmail={selectedEmail} />
        </div>
      </div>
    </div>
  );
}
