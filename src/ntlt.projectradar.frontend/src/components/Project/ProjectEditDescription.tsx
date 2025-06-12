/**
 * ProjectEditDescription Component - Description field for editing
 */

'use client';

import type { ProjectUpdateFormData } from '../../types/project';

interface ProjectEditDescriptionProps {
  formData: ProjectUpdateFormData;
  updateFormData: (updates: Partial<ProjectUpdateFormData>) => void;
}

export default function ProjectEditDescription({ 
  formData, 
  updateFormData 
}: ProjectEditDescriptionProps) {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-neutral-900 mb-2">
        Description
      </label>
      <textarea
        id="description"
        rows={4}
        value={formData.description || ''}
        onChange={(e) => updateFormData({ description: e.target.value || null })}
        className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter project description"
      />
    </div>
  );
}
