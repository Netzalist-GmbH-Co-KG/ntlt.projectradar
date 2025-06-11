'use client';

import React, { useState } from 'react';
import { PencilIcon, CurrencyEuroIcon, ClockIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { Project, ProjectUpdateFormData } from '../../types/project';
import { LoadingCard } from '../Loading/LoadingComponents';
import { ErrorMessage } from '../Error/ErrorComponents';
import { ProjectDetailsEdit } from './ProjectDetailsEdit';

interface ProjectDetailsProps {
  project: Project | null;
  isLoading?: boolean;
  error?: string | null;
  onUpdateProject?: (id: string, data: ProjectUpdateFormData) => Promise<boolean>;
  className?: string;
}

/**
 * ProjectDetails Component - ReadOnly view
 * Displays project information in a compact card layout with edit button
 */
export function ProjectDetails({ 
  project, 
  isLoading = false, 
  error = null, 
  onUpdateProject,
  className = '' 
}: ProjectDetailsProps) {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle save from edit component
  const handleSave = async (data: ProjectUpdateFormData): Promise<boolean> => {
    if (!project || !onUpdateProject) return false;
    
    const success = await onUpdateProject(project.id, data);
    if (success) {
      setIsEditing(false);
    }
    return success;
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-6 ${className}`}>
        <LoadingCard />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-6 ${className}`}>
        <ErrorMessage 
          message={error} 
          title="Failed to load project details"
        />
      </div>
    );
  }

  // No project selected state
  if (!project) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-6 ${className}`}>
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No Project Selected</h3>
          <p className="text-neutral-600">Select a project from the list to view details</p>
        </div>
      </div>
    );
  }

  // Show edit component if in editing mode
  if (isEditing) {
    return (
      <ProjectDetailsEdit
        project={project}
        onSave={handleSave}
        onCancel={handleCancel}
        className={className}
      />
    );
  }

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
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      {/* Header with Edit Button */}
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
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
          )}        </div>
        {onUpdateProject && (
          <button
            onClick={handleEditToggle}
            className="ml-4 p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            aria-label="Edit project"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        {project.description && (
          <div>
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Description</h3>
            <p className="text-neutral-700 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
        )}

        {/* Project Details Grid */}
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

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-neutral-900 mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
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
      </div>
    </div>
  );
}
