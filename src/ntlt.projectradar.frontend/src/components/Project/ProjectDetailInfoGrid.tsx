/**
 * ProjectDetailInfoGrid Component - Budget, Timeline, Contact info grid
 */

'use client';

import { CurrencyEuroIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import type { Project } from '../../types/project';

interface ProjectDetailInfoGridProps {
  project: Project;
}

export default function ProjectDetailInfoGrid({ project }: ProjectDetailInfoGridProps) {
  // Format display values
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Budget */}
      <div className="flex items-start space-x-3">
        <CurrencyEuroIcon className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
        <div>
          <dt className="text-sm font-medium text-neutral-900">Budget</dt>
          <dd className="text-sm text-neutral-700 mt-1">
            {formatBudget(project.budgetMin, project.budgetMax)}
          </dd>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-start space-x-3">
        <ClockIcon className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
        <div>
          <dt className="text-sm font-medium text-neutral-900">Timeline</dt>
          <dd className="text-sm text-neutral-700 mt-1">
            {formatTimeline(project.timeline)}
          </dd>
        </div>
      </div>

      {/* Contact Email */}
      {project.contactEmail && (
        <div className="flex items-start space-x-3">
          <UserIcon className="h-5 w-5 text-neutral-400 mt-0.5 flex-shrink-0" />
          <div>
            <dt className="text-sm font-medium text-neutral-900">Contact Email</dt>
            <dd className="text-sm text-neutral-700 mt-1">
              <a 
                href={`mailto:${project.contactEmail}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {project.contactEmail}
              </a>
            </dd>
          </div>
        </div>
      )}
    </div>
  );
}
