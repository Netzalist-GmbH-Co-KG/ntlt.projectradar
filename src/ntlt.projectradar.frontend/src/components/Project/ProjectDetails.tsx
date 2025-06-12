'use client';

import React, { useState } from 'react';
import type { Project, ProjectUpdateFormData } from '../../types/project';
import { ProjectDetailsEdit } from './ProjectDetailsEdit';
import ProjectDetailStates from './ProjectDetailStates';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectDetailDescription from './ProjectDetailDescription';
import ProjectDetailInfoGrid from './ProjectDetailInfoGrid';
import ProjectDetailTechnologies from './ProjectDetailTechnologies';
import ProjectDetailMetadata from './ProjectDetailMetadata';

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
  const [previousProject, setPreviousProject] = useState<Project | null>(null);

  // Keep track of previous project details to prevent layout shifts during loading
  const displayProject = project || (isLoading && previousProject ? previousProject : null);
  
  // Update previous project when we get new data
  if (project && (!previousProject || previousProject.id !== project.id)) {
    setPreviousProject(project);
  }

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  // Handle save from edit component
  const handleSave = async (data: ProjectUpdateFormData): Promise<boolean> => {
    if (!displayProject || !onUpdateProject) return false;
    
    const success = await onUpdateProject(displayProject.id, data);
    if (success) {
      setIsEditing(false); // Close edit mode on successful save
    }
    return success;
  };

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Handle different states with layout stability
  if (!project && !displayProject) {
    return <ProjectDetailStates type="no-selection" className={className} />;
  }

  if (error && !displayProject) {
    return <ProjectDetailStates type="error" error={error} className={className} />;
  }

  if (!displayProject && isLoading) {
    return <ProjectDetailStates type="loading" className={className} />;
  }

  if (!displayProject) {
    return <ProjectDetailStates type="no-selection" className={className} />;
  }

  // Show edit component if in editing mode
  if (isEditing) {
    return (
      <ProjectDetailsEdit
        project={displayProject}
        onSave={handleSave}
        onCancel={handleCancel}
        className={className}
      />
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 relative ${className}`}>
      {/* Show loading overlay if loading new project but keep previous content */}
      {isLoading && project !== displayProject && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header with Edit Button */}
      <ProjectDetailHeader 
        project={displayProject}
        showEditButton={!!onUpdateProject}
        onEdit={handleEditToggle}
      />

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <ProjectDetailDescription description={displayProject.description} />

        {/* Project Details Grid */}
        <ProjectDetailInfoGrid project={displayProject} />

        {/* Technologies */}
        <ProjectDetailTechnologies technologies={displayProject.technologies || []} />

        {/* Metadata */}
        <ProjectDetailMetadata project={displayProject} />
      </div>
    </div>
  );
}