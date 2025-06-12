'use client';

import React, { useState, useCallback, useRef } from 'react';
import type { Project, ProjectUpdateFormData } from '../../types/project';
import ProjectEditHeader from './ProjectEditHeader';
import ProjectEditBasicInfo from './ProjectEditBasicInfo';
import ProjectEditDescription from './ProjectEditDescription';
import ProjectEditBudgetTimeline from './ProjectEditBudgetTimeline';
import ProjectEditTechnologies from './ProjectEditTechnologies';

interface ProjectDetailsEditProps {
  project: Project;
  onSave: (data: ProjectUpdateFormData) => Promise<boolean>;
  onCancel: () => void;
  className?: string;
  isSaving?: boolean;
}

/**
 * ProjectDetailsEdit Component - Editable form for project details
 * Features manual save with change tracking
 */
export function ProjectDetailsEdit({ 
  project, 
  onSave, 
  onCancel,
  className = ''
}: ProjectDetailsEditProps) {
  // Form state
  const [formData, setFormData] = useState<ProjectUpdateFormData>({
    title: project.title || null,
    description: project.description || null,
    clientName: project.clientName || null,
    agencyName: project.agencyName || null,
    contactEmail: project.contactEmail || null,
    budgetMin: project.budgetMin || null,
    budgetMax: project.budgetMax || null,
    timeline: project.timeline || null,
    technologies: project.technologies || [],
  });

  // Local state for UI
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Keep track of initial data
  const initialDataRef = useRef(formData);

  // Handle manual save
  const handleSave = async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    
    try {
      const success = await onSave(formData);
      if (success) {
        setHasChanges(false);
        initialDataRef.current = { ...formData };
        // Don't close edit mode, let parent handle it via onSave callback
      } else {
        setSaveError('Failed to save changes');
      }
    } catch (error) {
      setSaveError(error instanceof Error ? 
        `Save failed: ${error.message}` : 
        'Save failed'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update form data and check for changes
  const updateFormData = useCallback((updates: Partial<ProjectUpdateFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    
    // Check if data has changed from initial state
    const dataChanged = JSON.stringify(newData) !== JSON.stringify(initialDataRef.current);
    setHasChanges(dataChanged);
    
    // Clear save error when user makes changes
    if (saveError) {
      setSaveError(null);
    }
  }, [formData, saveError]);
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      <ProjectEditHeader
        hasChanges={hasChanges}
        isSaving={isSaving}
        saveError={saveError}
        onSave={handleSave}
        onCancel={onCancel}
      />

      <div className="p-6 space-y-6">
        <ProjectEditBasicInfo
          formData={formData}
          updateFormData={updateFormData}
        />

        <ProjectEditDescription
          formData={formData}
          updateFormData={updateFormData}
        />

        <ProjectEditBudgetTimeline
          formData={formData}
          updateFormData={updateFormData}
        />

        <ProjectEditTechnologies
          formData={formData}
          updateFormData={updateFormData}
        />
      </div>
    </div>
  );
}
