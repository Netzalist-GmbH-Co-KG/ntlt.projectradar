/**
 * ProjectDetailHeader Component - Header section for ProjectDetails
 */

'use client';

import { PencilIcon } from '@heroicons/react/24/outline';
import type { Project } from '../../types/project';
import ProjectStatusBadge from './ProjectStatusBadge'; // Import ProjectStatusBadge

interface ProjectDetailHeaderProps {
  project: Project;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export default function ProjectDetailHeader({ 
  project, 
  showEditButton = false, 
  onEdit 
}: ProjectDetailHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-neutral-200 flex items-start justify-between">
      {/* Left Part: Title, Client, Agency */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-neutral-900 truncate">
          {project.title || 'Untitled Project'}
        </h2>
        {project.clientName && (
          <p className="text-sm text-neutral-600 mt-1">
            Client: {project.clientName}
          </p>
        )}
        {project.agencyName && (
          <p className="text-sm text-neutral-500 mt-1">
            via {project.agencyName}
          </p>
        )}
      </div>

      {/* Right Part: Status Badge and Edit Button */}
      <div className="ml-4 flex flex-col items-end">
        {project.currentStatus && (
          <div className="mb-1"> {/* Add margin below badge */}
            <ProjectStatusBadge status={project.currentStatus} />
          </div>
        )}
        {showEditButton && onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            aria-label="Edit project"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
