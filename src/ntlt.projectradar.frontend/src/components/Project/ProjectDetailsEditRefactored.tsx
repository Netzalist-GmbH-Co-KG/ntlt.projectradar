// filepath: c:\src\ntlt\ntlt.projectradar\src\ntlt.projectradar.frontend\src\components\Project\ProjectDetailsEdit.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Project, ProjectUpdateFormData } from '../../types/project';
import ProjectEditHeader from './ProjectEditHeader';
import ProjectEditBasicInfo from './ProjectEditBasicInfo';
import ProjectEditDescription from './ProjectEditDescription';
import ProjectEditBudgetTimeline from './ProjectEditBudgetTimeline';
import ProjectEditTechnologies from './ProjectEditTechnologies';
import ProjectEditFooter from './ProjectEditFooter';

interface ProjectDetailsEditProps {
  project: Project;
  onSave: (data: ProjectUpdateFormData) => Promise<boolean>;
  onCancel: () => void;
  className?: string;
  isSaving?: boolean;
}

/**
 * ProjectDetailsEdit Component - Editable form for project details
 * Features auto-save with debouncing, optimistic updates, and validation
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
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Refs for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialDataRef = useRef(formData);

  // Auto-save with debouncing (500ms delay) and optimistic updates
  const debouncedSave = useCallback(async (data: ProjectUpdateFormData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (hasChanges) {
        setIsAutoSaving(true);
        setSaveError(null);
        
        // Store current data for rollback (optimistic update already applied to UI)
        const rollbackData = { ...initialDataRef.current };
        
        try {
          const success = await onSave(data);
          if (success) {
            setHasChanges(false);
            setLastSaved(new Date());
            initialDataRef.current = { ...data }; // Update initial data on successful save
          } else {
            // Rollback on save failure
            setFormData(rollbackData);
            initialDataRef.current = rollbackData;
            setHasChanges(false);
            setSaveError('Failed to save changes - changes reverted');
          }
        } catch (error) {
          // Rollback on error
          setFormData(rollbackData);
          initialDataRef.current = rollbackData;
          setHasChanges(false);
          setSaveError(error instanceof Error ? 
            `Save failed: ${error.message} - changes reverted` : 
            'Save failed - changes reverted'
          );
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 500);
  }, [hasChanges, onSave]);

  // Update form data and trigger auto-save
  const updateFormData = useCallback((updates: Partial<ProjectUpdateFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    
    // Check if data has changed from initial state
    const dataChanged = JSON.stringify(newData) !== JSON.stringify(initialDataRef.current);
    setHasChanges(dataChanged);
    
    if (dataChanged) {
      debouncedSave(newData);
    }
  }, [formData, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      <ProjectEditHeader
        isAutoSaving={isAutoSaving}
        lastSaved={lastSaved}
        hasChanges={hasChanges}
        saveError={saveError}
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

        <ProjectEditFooter />
      </div>
    </div>
  );
}
