/**
 * Projects Split-View Page - Optional Catch-All Route
 * Route: /projects or /projects/{id}
 */

'use client';

import { useParams } from 'next/navigation';
import ProjectsSplitView from '../../../components/Project/ProjectsSplitView';

export default function ProjectsPage() {
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  return <ProjectsSplitView selectedProjectId={projectId} />;
}
