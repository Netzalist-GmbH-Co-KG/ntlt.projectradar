'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ProjectStatus, ProjectStatusUtils } from '../../types/project';

interface ProjectStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: ProjectStatus, comment?: string) => Promise<boolean>;
  currentStatus: ProjectStatus;
  projectTitle: string;
  isLoading?: boolean;
}

/**
 * Modal for changing project status with validation and comment input
 */
export default function ProjectStatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  projectTitle,
  isLoading = false
}: ProjectStatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(currentStatus);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available status options based on current status
  const availableStatuses = ProjectStatusUtils.getAvailableStatusTransitions(currentStatus);

  // Reset form when modal opens/closes or current status changes
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
      setComment('');
      setError(null);
    }
  }, [isOpen, currentStatus]);

  // Handle status selection
  const handleStatusChange = (status: ProjectStatus) => {
    setSelectedStatus(status);
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (ProjectStatusUtils.isCommentRequired(selectedStatus) && !comment.trim()) {
      setError('Kommentar ist erforderlich für diesen Status.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onConfirm(selectedStatus, comment.trim() || undefined);
      if (success) {
        onClose();
      } else {
        setError('Fehler beim Aktualisieren des Status. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  const isCommentRequired = ProjectStatusUtils.isCommentRequired(selectedStatus);
  const hasStatusChanged = selectedStatus !== currentStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Status ändern
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Project info */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Projekt:</p>
            <p className="font-medium text-gray-900 truncate">{projectTitle}</p>
          </div>

          {/* Current status */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Aktueller Status:</p>
            <div className="flex items-center">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${ProjectStatusUtils.getStatusColorClasses(currentStatus)}`}>
                {ProjectStatusUtils.getStatusDisplayText(currentStatus)}
              </span>
            </div>
          </div>

          {/* New status selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Neuer Status:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {availableStatuses.map((status) => (
                <label
                  key={status}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedStatus === status
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={() => handleStatusChange(status)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full mr-3 ${ProjectStatusUtils.getStatusColorClasses(status)}`}>
                    {ProjectStatusUtils.getStatusDisplayText(status)}
                  </span>
                  <span className="text-sm text-gray-700">
                    {status === currentStatus ? '(Aktuell)' : ''}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Comment field */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Kommentar {isCommentRequired && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isCommentRequired
                  ? 'Bitte geben Sie einen Kommentar ein (erforderlich)'
                  : 'Optional: Kommentar zur Statusänderung'
              }
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                isCommentRequired ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {isCommentRequired && (
              <p className="mt-1 text-xs text-red-600">
                Ein Kommentar ist für diesen Status erforderlich.
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              disabled={isSubmitting}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:ring-2 focus:ring-offset-2 transition-colors ${
                hasStatusChanged
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!hasStatusChanged || isSubmitting || isLoading}
            >
              {isSubmitting ? 'Wird gespeichert...' : 'Status ändern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
