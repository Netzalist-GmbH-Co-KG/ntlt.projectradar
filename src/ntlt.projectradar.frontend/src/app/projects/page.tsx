'use client';

import { useProjects } from '../../hooks/useProjects';
import { Breadcrumb } from '../../components/Navigation/Breadcrumb';
import { LoadingCard } from '../../components/Loading/LoadingComponents';
import { ErrorMessage } from '../../components/Error/ErrorComponents';
import Link from 'next/link';

export default function ProjectsPage() {
  const { filteredProjects, isLoading, error } = useProjects();

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <ErrorMessage 
          message={error} 
          title="Failed to load projects"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
        <p className="text-neutral-600 mt-1">
          Manage and view all project opportunities from various sources
        </p>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No Projects Found</h3>
          <p className="text-neutral-600">
            Projects will appear here once they are extracted from uploaded emails.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {project.title || 'Untitled Project'}
                  </h3>
                  {project.clientName && (
                    <p className="text-sm text-neutral-600 mb-2">
                      Client: {project.clientName}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-neutral-700 text-sm leading-relaxed mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-neutral-500">
                    <span>
                      Created: {project.createdAt?.toLocaleDateString('de-DE')}
                    </span>
                    {project.budgetMin && (
                      <span>
                        Budget: From €{project.budgetMin.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
