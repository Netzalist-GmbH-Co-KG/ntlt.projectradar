/**
 * Projects Split-View Page - Optional Catch-All Route
 * Route: /projects or /projects/{id}
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProjectsSplitView from '../../../components/Project/ProjectsSplitView';

export default function ProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Handle URL changes with smooth navigation (no page reload)
  const handleProjectIdChange = (newProjectId: string | undefined) => {
    const newUrl = newProjectId ? `/projects/${newProjectId}` : '/projects';
    
    // Use window.history.pushState for shallow routing without page reload
    window.history.pushState({}, '', newUrl);
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Force re-render when user navigates with browser buttons
      router.refresh();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  return <ProjectsSplitView selectedProjectId={projectId} onProjectIdChange={handleProjectIdChange} />;
}
