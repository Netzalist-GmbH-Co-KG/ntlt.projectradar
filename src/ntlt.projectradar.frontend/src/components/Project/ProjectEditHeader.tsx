/**
 * ProjectEditHeader Component - Header for edit mode with save status
 */

'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../Loading/LoadingComponents';

interface ProjectEditHeaderProps {
  isAutoSaving: boolean;
  lastSaved: Date | null;
  hasChanges: boolean;
  saveError: string | null;
  onCancel: () => void;
}

export default function ProjectEditHeader({ 
  isAutoSaving,
  lastSaved,
  hasChanges,
  saveError,
  onCancel 
}: ProjectEditHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-neutral-900">
          Edit Project
        </h2>
        <div className="flex items-center mt-1 space-x-4">
          {isAutoSaving && (
            <div className="flex items-center text-sm text-blue-600">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          )}
          {lastSaved && !hasChanges && !isAutoSaving && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckIcon className="h-4 w-4 mr-1" />
              Saved {lastSaved.toLocaleTimeString()}
            </p>
          )}
          {hasChanges && !isAutoSaving && (
            <p className="text-sm text-amber-600">
              Unsaved changes
            </p>
          )}
          {saveError && (
            <p className="text-sm text-red-600 flex items-center">
              <XMarkIcon className="h-4 w-4 mr-1" />
              {saveError}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onCancel}
        className="ml-4 p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
        aria-label="Cancel editing"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
