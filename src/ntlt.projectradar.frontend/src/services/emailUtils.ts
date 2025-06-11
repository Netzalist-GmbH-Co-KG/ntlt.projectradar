/**
 * Email utility functions and helper methods
 */

import { EmailDetailsDto, EmailListDto } from './apiService';

export interface EmailDisplayOptions {
  showHtml: boolean;
  maxSubjectLength: number;
  dateFormat: 'relative' | 'absolute';
}

/**
 * Format email date for display
 */
export const formatEmailDate = (
  dateString: string | null,
  format: 'relative' | 'absolute' = 'relative'
): string => {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (format === 'absolute') {
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Relative formatting
  if (diffDays === 0) {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (diffDays === 1) {
    return 'Gestern';
  } else if (diffDays < 7) {
    return `${diffDays} Tage`;
  } else {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit'
    });
  }
};

/**
 * Truncate email subject for list display
 */
export const truncateSubject = (subject: string, maxLength: number = 50): string => {
  if (!subject) return '(Kein Betreff)';
  if (subject.length <= maxLength) return subject;
  return `${subject.substring(0, maxLength)}...`;
};

/**
 * Extract sender name from email address
 */
export const extractSenderName = (emailFrom: string): string => {
  if (!emailFrom) return 'Unknown Sender';
  
  // Check if it's in "Name <email@domain.com>" format
  const nameMatch = emailFrom.match(/^(.+?)\s*<.+>$/);
  if (nameMatch) {
    return nameMatch[1].trim().replace(/['"]/g, '');
  }
  
  // Return just the email address
  return emailFrom;
};

/**
 * Extract email address from "Name <email@domain.com>" format
 */
export const extractEmailAddress = (emailString: string): string => {
  if (!emailString) return '';
  
  const emailMatch = emailString.match(/<(.+?)>/);
  return emailMatch ? emailMatch[1] : emailString;
};

/**
 * Get MIME type display name
 */
export const getMimeTypeDisplayName = (mimeType: string): string => {
  const mimeMap: Record<string, string> = {
    'application/pdf': 'PDF Document',
    'application/msword': 'Word Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.ms-excel': 'Excel Spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'text/plain': 'Text File',
    'text/csv': 'CSV File',
    'application/zip': 'ZIP Archive',
    'application/x-rar-compressed': 'RAR Archive'
  };

  return mimeMap[mimeType] || mimeType;
};

/**
 * Format attachment file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if email has HTML content
 */
export const hasHtmlContent = (email: EmailDetailsDto): boolean => {
  return !!(email.emailBodyHtml && email.emailBodyHtml.trim().length > 0);
};

/**
 * Check if email has text content
 */
export const hasTextContent = (email: EmailDetailsDto): boolean => {
  return !!(email.emailBodyText && email.emailBodyText.trim().length > 0);
};

/**
 * Get preferred email content (HTML if available, otherwise text)
 */
export const getPreferredContent = (email: EmailDetailsDto, preferHtml: boolean = true): {
  content: string;
  isHtml: boolean;
} => {
  if (preferHtml && hasHtmlContent(email)) {
    return {
      content: email.emailBodyHtml,
      isHtml: true
    };
  }
  
  if (hasTextContent(email)) {
    return {
      content: email.emailBodyText,
      isHtml: false
    };
  }
  
  return {
    content: 'Keine Inhalte verfügbar',
    isHtml: false
  };
};

/**
 * Sanitize HTML content for safe display
 */
export const sanitizeHtmlContent = (htmlContent: string): string => {
  // Basic HTML sanitization - in production, consider using DOMPurify
  return htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

/**
 * Generate email preview text from content
 */
export const generateEmailPreview = (email: EmailDetailsDto, maxLength: number = 100): string => {
  const { content, isHtml } = getPreferredContent(email, false); // Prefer text for preview
  
  if (!content) return 'Keine Vorschau verfügbar';
  
  let preview = content;
  
  if (isHtml) {
    // Strip HTML tags for preview
    preview = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  return preview.length > maxLength ? `${preview.substring(0, maxLength)}...` : preview;
};
