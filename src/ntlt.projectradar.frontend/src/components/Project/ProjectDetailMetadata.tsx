/**
 * ProjectDetailMetadata Component - Project metadata display
 */

'use client';

import type { Project } from '../../types/project';

interface ProjectDetailMetadataProps {
  project: Project;
}

export default function ProjectDetailMetadata({ project }: ProjectDetailMetadataProps) {
  return (
    <div className="pt-4 border-t border-neutral-200">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <dt className="font-medium text-neutral-900">Project ID</dt>
          <dd className="text-neutral-600 mt-1 font-mono">{project.id}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-900">Created</dt>
          <dd className="text-neutral-600 mt-1">
            {project.createdAt?.toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </dd>
        </div>
      </dl>
    </div>
  );
}
