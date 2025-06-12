/**
 * ProjectEditBudgetTimeline Component - Budget and timeline form fields
 */

'use client';

import type { ProjectUpdateFormData } from '../../types/project';

interface ProjectEditBudgetTimelineProps {
  formData: ProjectUpdateFormData;
  updateFormData: (updates: Partial<ProjectUpdateFormData>) => void;
}

export default function ProjectEditBudgetTimeline({ 
  formData, 
  updateFormData 
}: ProjectEditBudgetTimelineProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Budget Min */}
      <div>
        <label htmlFor="budgetMin" className="block text-sm font-medium text-neutral-900 mb-2">
          Budget Min (€)
        </label>
        <input
          type="number"
          id="budgetMin"
          value={formData.budgetMin || ''}
          onChange={(e) => updateFormData({ 
            budgetMin: e.target.value ? Number(e.target.value) : null 
          })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="0"
          min="0"
        />
      </div>

      {/* Budget Max */}
      <div>
        <label htmlFor="budgetMax" className="block text-sm font-medium text-neutral-900 mb-2">
          Budget Max (€)
        </label>
        <input
          type="number"
          id="budgetMax"
          value={formData.budgetMax || ''}
          onChange={(e) => updateFormData({ 
            budgetMax: e.target.value ? Number(e.target.value) : null 
          })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="0"
          min="0"
        />
      </div>

      {/* Timeline */}
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-neutral-900 mb-2">
          Timeline
        </label>
        <input
          type="text"
          id="timeline"
          value={formData.timeline || ''}
          onChange={(e) => updateFormData({ timeline: e.target.value || null })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 3 months, 6-8 weeks"
        />
      </div>
    </div>
  );
}
