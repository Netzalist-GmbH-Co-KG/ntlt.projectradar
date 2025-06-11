'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Project, ProjectUpdateFormData } from '../../types/project';
import { LoadingSpinner } from '../Loading/LoadingComponents';

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
  const [techInput, setTechInput] = useState('');

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

  // Handle technology management
  const addTechnology = useCallback((tech: string) => {
    const trimmedTech = tech.trim();
    if (trimmedTech && !formData.technologies.includes(trimmedTech)) {
      updateFormData({
        technologies: [...formData.technologies, trimmedTech]
      });
    }
    setTechInput('');
  }, [formData.technologies, updateFormData]);

  const removeTechnology = useCallback((index: number) => {
    updateFormData({
      technologies: formData.technologies.filter((_, i) => i !== index)
    });
  }, [formData.technologies, updateFormData]);

  const handleTechInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(techInput);
    } else if (e.key === 'Escape') {
      setTechInput('');
    }
  }, [techInput, addTechnology]);

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
      {/* Header with Save Status */}
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

      {/* Edit Form */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
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

        {/* Description */}
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

        {/* Budget and Timeline */}
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

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            Technologies
          </label>
          <div className="space-y-3">
            {/* Current Technologies */}
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Add Technology Input */}
            <div className="flex">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechInputKeyDown}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add technology (press Enter)"
              />
              <button
                type="button"
                onClick={() => addTechnology(techInput)}
                disabled={!techInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Auto-save Info */}
        <div className="pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            Changes are automatically saved as you type. No need to manually save.
          </p>
        </div>
      </div>
    </div>
  );
}
