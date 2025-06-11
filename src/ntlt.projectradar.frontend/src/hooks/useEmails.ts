/**
 * Custom React hooks for email data management
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService, EmailListResponseDto, EmailDetailsDto, EmailListDto } from '../services/apiService';

export interface UseEmailsOptions {
  page?: number;
  pageSize?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseEmailsResult {
  emails: EmailListDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

/**
 * Hook for managing email list with pagination
 */
export const useEmails = (options: UseEmailsOptions = {}): UseEmailsResult => {
  const {
    page = 1,
    pageSize = 100,
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  const [emailData, setEmailData] = useState<EmailListResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchEmails = useCallback(async (pageToFetch: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getEmails(pageToFetch, pageSize);
      setEmailData(data);
      setCurrentPage(pageToFetch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  const refetch = useCallback(() => fetchEmails(currentPage), [fetchEmails, currentPage]);

  const loadNextPage = useCallback(async () => {
    if (emailData?.hasNextPage) {
      await fetchEmails(currentPage + 1);
    }
  }, [emailData?.hasNextPage, fetchEmails, currentPage]);

  const loadPreviousPage = useCallback(async () => {
    if (emailData?.hasPreviousPage) {
      await fetchEmails(currentPage - 1);
    }
  }, [emailData?.hasPreviousPage, fetchEmails, currentPage]);

  const goToPage = useCallback(async (pageNumber: number) => {
    await fetchEmails(pageNumber);
  }, [fetchEmails]);
  // Initial load
  useEffect(() => {
    fetchEmails(page);
  }, [page, pageSize, fetchEmails]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refetch, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refetch]);

  return {
    emails: emailData?.emails || [],
    totalCount: emailData?.totalCount || 0,
    currentPage,
    totalPages: emailData?.totalPages || 0,
    hasNextPage: emailData?.hasNextPage || false,
    hasPreviousPage: emailData?.hasPreviousPage || false,
    isLoading,
    error,
    refetch,
    loadNextPage,
    loadPreviousPage,
    goToPage
  };
};

export interface UseEmailDetailsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseEmailDetailsResult {
  email: EmailDetailsDto | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing single email details
 */
export const useEmailDetails = (
  emailId: string | null,
  options: UseEmailDetailsOptions = {}
): UseEmailDetailsResult => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [email, setEmail] = useState<EmailDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmail = useCallback(async () => {
    if (!emailId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getEmailById(emailId);
      setEmail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch email details');
      setEmail(null);
    } finally {
      setIsLoading(false);
    }
  }, [emailId]);

  const refetch = useCallback(() => fetchEmail(), [fetchEmail]);

  // Load email when ID changes
  useEffect(() => {
    if (emailId) {
      fetchEmail();
    } else {
      setEmail(null);
      setError(null);
      setIsLoading(false);
    }
  }, [emailId, fetchEmail]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !emailId) return;

    const interval = setInterval(refetch, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refetch, emailId]);

  return {
    email,
    isLoading,
    error,
    refetch
  };
};

/**
 * Hook for managing attachment downloads
 */
export const useAttachmentDownload = () => {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const downloadAttachment = useCallback(async (attachmentId: string, filename: string) => {
    try {
      setIsDownloading(attachmentId);
      setError(null);
      await apiService.downloadAttachmentAsFile(attachmentId, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsDownloading(null);
    }
  }, []);

  return {
    downloadAttachment,
    isDownloading,
    error,
    clearError: () => setError(null)
  };
};
