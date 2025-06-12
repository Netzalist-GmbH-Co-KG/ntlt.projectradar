/**
 * ProjectList Component - Compact list of all projects
 * Similar to EmailList but without pagination
 */

'use client';

import { useRouter } from 'next/navigation';
import { Project, ProjectStatus } from '../../types/project'; // Added ProjectStatus import
import { LoadingCard } from '../Loading/LoadingComponents';
import ProjectStatusBadge from './ProjectStatusBadge';

interface ProjectListProps {
  projects: Project[];
  selectedProjectId?: string;
  onProjectSelect?: (project: Project) => void;
  isLoading: boolean;
}

export default function ProjectList({ 
  projects, 
  selectedProjectId, 
  onProjectSelect,
  isLoading 
}: ProjectListProps) {
  const router = useRouter();

  // Helper function to extract border color from badge's utility
  const getBorderColorClass = (status: ProjectStatus): string => {
    // This function provides the Tailwind class for the left border color
    switch (status) {
      case ProjectStatus.New:
        return 'border-l-blue-500';
      case ProjectStatus.InterestingCold:
        return 'border-l-sky-500';
      case ProjectStatus.InterestingContacted:
        return 'border-l-yellow-500';
      case ProjectStatus.InterestingInProgress:
        return 'border-l-orange-500';
      case ProjectStatus.Won:
        return 'border-l-green-500';
      case ProjectStatus.Lost:
        return 'border-l-red-500';
      case ProjectStatus.NotInteresting:
      case ProjectStatus.MissedOpportunity:
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-300';
    }
  };

  // Format helper functions
  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    if (min) return `From €${min.toLocaleString()}`;
    if (max) return `Up to €${max.toLocaleString()}`;
    return 'Not specified';
  };

  const formatTimeline = (timeline?: string | null) => {
    return timeline || 'Not specified';
  };

  const handleProjectSelect = (project: Project) => {
    if (onProjectSelect) {
      // Use callback for smooth navigation
      onProjectSelect(project);
    } else {
      // Fallback: use Next.js router if no callback provided
      router.push(`/projects/${project.id}`);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex-1 p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <LoadingCard key={index} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No Projects Found</h3>
          <p className="text-neutral-600">
            Projects will appear here once they are extracted from uploaded emails.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project List */}
      <div className="flex-1 overflow-y-auto">        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleProjectSelect(project)}
            className={`
              border-b border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition-colors relative
              border-l-5 ${getBorderColorClass(project.currentStatus)} // Added left border with status color
              ${selectedProjectId === project.id ? 'bg-blue-50 !border-l-blue-700' : ''} // Ensure selected border overrides status border, made it darker for selection
              ${(project.currentStatus === 'NotInteresting' || project.currentStatus === 'MissedOpportunity') ? 'opacity-60 hover:opacity-100' : ''}
            `}
          >
            {/* First Line: Title and Created Date */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm text-neutral-900 truncate flex-1 pr-2">
                {project.title || 'Untitled Project'}
              </h3>
              {/* Date is now part of the main flow, badge moved down */}
              <span className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                {project.createdAt?.toLocaleDateString('de-DE')}
              </span>
            </div>
            
            {/* Second Line: Client/Agency */}
            {(project.clientName || project.agencyName) && (
              <div className="text-xs text-neutral-600 mb-2 truncate">
                {project.clientName && (
                  <span>Client: {project.clientName}</span>
                )}
                {project.clientName && project.agencyName && <span> • </span>}
                {project.agencyName && (
                  <span>via {project.agencyName}</span>
                )}
              </div>
            )}            {/* Third Line: Budget and Timeline */}
            <div className="flex flex-col gap-1 text-xs text-neutral-500">
              <span className="truncate">
                {project.budgetMin || project.budgetMax ? (
                  `Budget: ${formatBudget(project.budgetMin, project.budgetMax)}`
                ) : (
                  'No budget specified'
                )}
              </span>
              {project.timeline && (
                <div className="break-words text-wrap">
                  Timeline: {formatTimeline(project.timeline)}
                </div>
              )}
            </div>

            {/* Fourth Line: Technologies & Status Badge */}
            {(project.technologies && project.technologies.length > 0 || project.currentStatus) && (
              <div className="mt-3 flex flex-wrap gap-1 items-center justify-between">
                <div className="flex flex-wrap gap-1 items-center">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs text-neutral-500">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                {project.currentStatus && (
                  <div className="mt-2 sm:mt-0 flex-shrink-0">
                     <ProjectStatusBadge status={project.currentStatus} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && projects.length > 0 && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
