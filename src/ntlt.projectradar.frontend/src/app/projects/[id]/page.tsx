'use client';

import { useParams } from 'next/navigation';
import { useProjectDetail } from '../../../hooks/useProjects';
import { ProjectDetails } from '../../../components/Project/ProjectDetails';
import { Breadcrumb } from '../../../components/Navigation/Breadcrumb';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { 
    project, 
    isLoading, 
    error 
  } = useProjectDetail(projectId);

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' },
    { label: project?.title || 'Loading...', href: `/projects/${projectId}` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>      {/* Project Details */}
      <ProjectDetails
        project={project || null}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
