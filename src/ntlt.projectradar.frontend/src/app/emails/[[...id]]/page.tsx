/**
 * Emails Split-View Page - Single Page with URL-based state
 * Route: /emails or /emails/{id}
 * Uses shallow routing for smooth navigation without page reloads
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import EmailsSplitView from '../../../components/Email/EmailsSplitView';

export default function EmailsPage() {
  const params = useParams();
  const router = useRouter();
  const [currentEmailId, setCurrentEmailId] = useState<string | undefined>();
  
  // Extract email ID from URL params
  const emailId = Array.isArray(params.id) ? params.id[0] : params.id;
    // Update state when URL changes (browser navigation)
  useEffect(() => {
    setCurrentEmailId(emailId);
  }, [emailId]);
  
  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Extract email ID from current URL
      const path = window.location.pathname;
      const match = path.match(/\/emails\/([^\/]+)/);
      const newEmailId = match ? match[1] : undefined;
      setCurrentEmailId(newEmailId);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // Handle email selection with shallow routing
  const handleEmailIdChange = (newEmailId: string | undefined) => {
    setCurrentEmailId(newEmailId);
    
    // Update URL without page reload using window.history for true shallow routing
    const newUrl = newEmailId ? `/emails/${newEmailId}` : '/emails';
    
    // Use browser history API for truly shallow navigation without any React re-renders
    if (typeof window !== 'undefined') {
      window.history.pushState({ emailId: newEmailId }, '', newUrl);
    }
  };

  return (
    <EmailsSplitView 
      selectedEmailId={currentEmailId}
      onEmailIdChange={handleEmailIdChange}
    />
  );
}
