/**
 * ProjectEditTechnologies Component - Technology management for editing
 */

'use client';

import React, { useState, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ProjectUpdateFormData } from '../../types/project';

interface ProjectEditTechnologiesProps {
  formData: ProjectUpdateFormData;
  updateFormData: (updates: Partial<ProjectUpdateFormData>) => void;
}

export default function ProjectEditTechnologies({ 
  formData, 
  updateFormData 
}: ProjectEditTechnologiesProps) {
  const [techInput, setTechInput] = useState('');

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

  return (
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
  );
}
