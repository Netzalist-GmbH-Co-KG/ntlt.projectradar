// filepath: c:\src\ntlt\ntlt.projectradar\src\ntlt.projectradar.frontend\src\components\Project\ProjectDetails.tsx
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
  };

  // Loading state
  if (isLoading) {
    return <ProjectDetailStates type="loading" className={className} />;
  }

  // Error state
  if (error) {
    return <ProjectDetailStates type="error" error={error} className={className} />;
  }

  // No project selected state
  if (!project) {
    return <ProjectDetailStates type="no-selection" className={className} />;
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

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      <ProjectDetailHeader 
        project={project}
        showEditButton={!!onUpdateProject}
        onEdit={handleEditToggle}
      />

      <div className="p-6 space-y-6">
        <ProjectDetailDescription description={project.description} />
        <ProjectDetailInfoGrid project={project} />
        <ProjectDetailTechnologies technologies={project.technologies || []} />
        <ProjectDetailMetadata project={project} />
      </div>
    </div>
  );
}
