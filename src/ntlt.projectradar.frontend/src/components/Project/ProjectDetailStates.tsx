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
  // Get content based on type
  const getContent = () => {
    if (type === 'loading') {
      return {
        icon: <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>,
        title: 'Projekt wird geladen...',
        description: 'Bitte warten Sie einen Moment.',
        bgColor: 'bg-blue-100'
      };
    }

    if (type === 'error') {
      return {
        icon: (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: 'Fehler beim Laden',
        description: error || 'Ein unbekannter Fehler ist aufgetreten.',
        bgColor: 'bg-red-100'
      };
    }

    // type === 'no-selection'
    return {
      icon: <BuildingOfficeIcon className="h-8 w-8 text-neutral-400" />,
      title: 'Kein Projekt ausgewählt',
      description: 'Wählen Sie ein Projekt aus der Liste aus, um die Details anzuzeigen.',
      bgColor: 'bg-neutral-100'
    };
  };

  const content = getContent();

  // Use the same layout structure as ProjectDetails to prevent layout shifting
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      {/* Header Section - matches ProjectDetailHeader structure */}
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {/* Empty header space to match ProjectDetailHeader height */}
          <div className="h-6"></div>
          <div className="h-4 mt-1"></div>
        </div>
      </div>

      {/* Content Section - matches ProjectDetails content structure */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 ${content.bgColor} rounded-full flex items-center justify-center`}>
              {content.icon}
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              {content.title}
            </h3>
            <p className="text-neutral-600">
              {content.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
