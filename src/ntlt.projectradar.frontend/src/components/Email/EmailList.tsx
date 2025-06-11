/**
 * Email List Component - Kompakte Liste mit Pagination
 */

'use client';

import { EmailListDto } from '../../services/apiService';
import { formatEmailDate, truncateSubject, extractSenderName } from '../../services/emailUtils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface EmailListProps {
  emails: EmailListDto[];
  selectedEmail: EmailListDto | null;
  onEmailSelect: (email: EmailListDto) => void;
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onLoadNextPage: () => void;
  onLoadPreviousPage: () => void;
  onGoToPage: (page: number) => void;
}

export default function EmailList({
  emails,
  selectedEmail,
  onEmailSelect,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onLoadNextPage,
  onLoadPreviousPage,
  onGoToPage
}: EmailListProps) {
  
  if (isLoading && emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-neutral-600">E-Mails werden geladen...</p>
        </div>
      </div>
    );
  }

  if (emails.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-neutral-600 mb-2">Keine E-Mails gefunden</p>
          <p className="text-sm text-neutral-500">
            Laden Sie EML-Dateien hoch, um E-Mails anzuzeigen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailSelect(email)}
            className={`
              border-b border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition-colors
              ${selectedEmail?.id === email.id ? 'bg-blue-50 border-blue-200' : ''}
            `}
          >
            {/* First Line: Sender and Date */}
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-neutral-900 truncate">
                {extractSenderName(email.emailFrom)}
              </span>
              <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">
                {formatEmailDate(email.emailDate, 'relative')}
              </span>
            </div>
            
            {/* Second Line: Subject */}
            <div className="text-sm text-neutral-700 truncate mb-1">
              {truncateSubject(email.emailSubject, 60)}
            </div>
            
            {/* Third Line: Attachments indicator */}
            {email.hasAttachments && (
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-3 h-3 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-neutral-500">
                  {email.attachments.length} Anhang{email.attachments.length !== 1 ? 'e' : ''}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && emails.length > 0 && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-neutral-200 p-4 bg-neutral-50">
          <div className="flex items-center justify-between">
            {/* Page Info */}
            <span className="text-sm text-neutral-600">
              Seite {currentPage} von {totalPages} ({totalCount} E-Mails)
            </span>
            
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={onLoadPreviousPage}
                disabled={!hasPreviousPage || isLoading}
                className="p-1.5 rounded-md border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              {/* Page Numbers (show current ± 2) */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNumber <= totalPages) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => onGoToPage(pageNumber)}
                        disabled={isLoading}
                        className={`
                          px-2 py-1 text-sm rounded-md border disabled:cursor-not-allowed
                          ${pageNumber === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-neutral-300 hover:bg-white'
                          }
                        `}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={onLoadNextPage}
                disabled={!hasNextPage || isLoading}
                className="p-1.5 rounded-md border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
