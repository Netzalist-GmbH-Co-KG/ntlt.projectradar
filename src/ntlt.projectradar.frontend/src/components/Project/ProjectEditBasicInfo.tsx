/**
 * ProjectEditBasicInfo Component - Basic project information form fields
 */

'use client';

import type { ProjectUpdateFormData } from '../../types/project';

interface ProjectEditBasicInfoProps {
  formData: ProjectUpdateFormData;
  updateFormData: (updates: Partial<ProjectUpdateFormData>) => void;
}

export default function ProjectEditBasicInfo({ 
  formData, 
  updateFormData 
}: ProjectEditBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Project Title */}
      <div className="md:col-span-2">
        <label htmlFor="title" className="block text-sm font-medium text-neutral-900 mb-2">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title || ''}
          onChange={(e) => updateFormData({ title: e.target.value || null })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter project title"
        />
      </div>

      {/* Client Name */}
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-neutral-900 mb-2">
          Client Name
        </label>
        <input
          type="text"
          id="clientName"
          value={formData.clientName || ''}
          onChange={(e) => updateFormData({ clientName: e.target.value || null })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter client name"
        />
      </div>

      {/* Agency Name */}
      <div>
        <label htmlFor="agencyName" className="block text-sm font-medium text-neutral-900 mb-2">
          Agency Name
        </label>
        <input
          type="text"
          id="agencyName"
          value={formData.agencyName || ''}
          onChange={(e) => updateFormData({ agencyName: e.target.value || null })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter agency name"
        />
      </div>

      {/* Contact Email */}
      <div className="md:col-span-2">
        <label htmlFor="contactEmail" className="block text-sm font-medium text-neutral-900 mb-2">
          Contact Email
        </label>
        <input
          type="email"
          id="contactEmail"
          value={formData.contactEmail || ''}
          onChange={(e) => updateFormData({ contactEmail: e.target.value || null })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter contact email"
        />
      </div>
    </div>
  );
}
