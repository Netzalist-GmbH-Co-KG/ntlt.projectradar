/**
 * ProjectDetailStates Component - Loading/Error/Empty States for ProjectDetails
 */

'use client';

import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { LoadingCard } from '../Loading/LoadingComponents';
import { ErrorMessage } from '../Error/ErrorComponents';

interface ProjectDetailStatesProps {
  type: 'loading' | 'error' | 'no-selection';
  error?: string | null;
  className?: string;
}

export default function ProjectDetailStates({ 
  type, 
  error, 
  className = '' 
}: ProjectDetailStatesProps) {
  const baseClasses = `bg-white rounded-lg shadow-sm border border-neutral-200 p-6 ${className}`;

  if (type === 'loading') {
    return (
      <div className={baseClasses}>
        <LoadingCard />
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className={baseClasses}>
        <ErrorMessage 
          message={error || 'Unknown error occurred'} 
          title="Failed to load project details"
        />
      </div>
    );
  }

  // type === 'no-selection'
  return (
    <div className={baseClasses}>
      <div className="text-center py-12">
        <BuildingOfficeIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No Project Selected</h3>
        <p className="text-neutral-600">Select a project from the list to view details</p>
      </div>
    </div>
  );
}
