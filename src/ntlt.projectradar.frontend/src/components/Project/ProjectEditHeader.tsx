/**
 * ProjectEditHeader Component - Header for edit mode with manual save/cancel buttons
 */

'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../Loading/LoadingComponents';

interface ProjectEditHeaderProps {
  hasChanges: boolean;
  isSaving: boolean;
  saveError: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProjectEditHeader({ 
  hasChanges,
  isSaving,
  saveError,
  onSave,
  onCancel 
}: ProjectEditHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-neutral-900">
          Edit Project
        </h2>
        <div className="flex items-center mt-1">
          {hasChanges && !isSaving && (
            <p className="text-sm text-amber-600">
              You have unsaved changes
            </p>
          )}
          {isSaving && (
            <div className="flex items-center text-sm text-blue-600">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          )}
          {saveError && (
            <p className="text-sm text-red-600 flex items-center">
              <XMarkIcon className="h-4 w-4 mr-1" />
              {saveError}
            </p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          className={`
            p-2 rounded-md transition-colors flex items-center justify-center
            ${hasChanges && !isSaving 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }
          `}
          aria-label="Save changes"
          title="Save changes"
        >
          <CheckIcon className="h-5 w-5" />
        </button>
        
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Cancel editing"
          title="Cancel editing"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
