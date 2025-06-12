/**
 * EmailDetailHeader Component - Email Header Section
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailDetailsDto } from '../../services/apiService';
import { 
  extractSenderName, 
  formatEmailDate, 
  extractEmailAddress,
  hasHtmlContent,
  hasTextContent
} from '../../services/emailUtils';
import { useProjectsByEmail } from '../../hooks/useProjects';
import { ProjectDetails } from '../Project/ProjectDetails';
import EmailDetailAttachments from './EmailDetailAttachments';

interface EmailDetailHeaderProps {
  emailDetails: EmailDetailsDto;
  showHtml: boolean;
  onToggleView: (showHtml: boolean) => void;
  onAttachmentDownload: (attachmentId: string, filename: string) => void;
  isDownloading: string | null;
  downloadError: string | null;
}

export default function EmailDetailHeader({ 
  emailDetails, 
  showHtml, 
  onToggleView, 
  onAttachmentDownload, 
  isDownloading, 
  downloadError 
}: EmailDetailHeaderProps) {
  const hasHtml = hasHtmlContent(emailDetails);
  const hasText = hasTextContent(emailDetails);
  const router = useRouter();
  
  // Load projects linked to this email
  const { projects, isLoading: projectsLoading } = useProjectsByEmail(emailDetails.id);
  
  // Overlay state for project details
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [overlayPosition, setOverlayPosition] = useState<{ x: number; y: number } | null>(null);  // Handle project hover (desktop)
  const handleProjectHover = (projectId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const overlayWidth = Math.min(600, window.innerWidth - 40);
    setOverlayPosition({
      x: Math.min(rect.right - overlayWidth + 20, window.innerWidth - overlayWidth - 20), // Position with padding
      y: rect.bottom + 8   // Position below the button with small gap
    });
    setHoveredProject(projectId);
  };
  // Handle project touch (mobile)
  const handleProjectTouch = (projectId: string, event: React.TouchEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const overlayWidth = Math.min(600, window.innerWidth - 40);
    setOverlayPosition({
      x: Math.min(rect.right - overlayWidth + 20, window.innerWidth - overlayWidth - 20),
      y: rect.bottom + 8
    });
    setHoveredProject(hoveredProject === projectId ? null : projectId);
  };

  // Handle project click
  const handleProjectClick = (projectId: string) => {
    // Small delay to allow overlay to show on touch devices
    setTimeout(() => {
      router.push(`/projects/${projectId}`);
    }, hoveredProject ? 300 : 0);
  };
  return (
    <div className="border-b border-neutral-200 p-6 bg-white flex-shrink-0 relative">
      <div className="space-y-4">
        {/* Subject with Projects List */}
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-xl font-semibold text-neutral-900 flex-1">
            {emailDetails.emailSubject || '(Kein Betreff)'}
          </h2>
          
          {/* Projects List - Right side */}
          {projects.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Verknüpfte Projekte
              </span>
              <div className="flex flex-wrap gap-1 justify-end max-w-xs">                {projects.map((project) => (
                  <button
                    key={project.id}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors touch-manipulation"
                    onMouseEnter={(e) => handleProjectHover(project.id, e)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onTouchStart={(e) => handleProjectTouch(project.id, e)}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    {project.title || 'Unbenanntes Projekt'}
                  </button>
                ))}
              </div>
              {projectsLoading && (
                <span className="text-xs text-neutral-400">Lade Projekte...</span>
              )}
            </div>
          )}
        </div>
        
        {/* From/To/Date */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700 w-16">Von:</span>
            <div className="flex flex-col">
              <span className="text-sm text-neutral-900">{extractSenderName(emailDetails.emailFrom)}</span>
              <span className="text-xs text-neutral-500">{extractEmailAddress(emailDetails.emailFrom)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700 w-16">An:</span>
            <span className="text-sm text-neutral-900">{emailDetails.emailTo}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700 w-16">Datum:</span>
            <span className="text-sm text-neutral-900">
              {formatEmailDate(emailDetails.emailDate, 'absolute')}
            </span>
          </div>
        </div>

        {/* Content Toggle */}
        {(hasHtml && hasText) && (
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm font-medium text-neutral-700">Ansicht:</span>
            <div className="flex bg-neutral-100 rounded-md p-1">
              <button
                onClick={() => onToggleView(true)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  showHtml 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => onToggleView(false)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  !showHtml 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Text
              </button>
            </div>
          </div>
        )}


        {/* Attachments */}
        <EmailDetailAttachments
          attachments={emailDetails.attachments}
          onDownload={onAttachmentDownload}
          isDownloading={isDownloading}
          error={downloadError}
        />
      </div>        {/* Project Details Overlay */}
      {hoveredProject && overlayPosition && (
        <div 
          className="fixed z-50 max-w-2xl bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden"
          style={{
            left: Math.min(overlayPosition.x, window.innerWidth - 600), // Ensure it fits in viewport
            top: overlayPosition.y,
            width: Math.min(600, window.innerWidth - 40), 
            pointerEvents: 'none'
          }}
          onMouseEnter={() => setHoveredProject(hoveredProject)} 
        >
          <div className="overflow-hidden max-w-full">
            <ProjectDetails
              project={projects.find(p => p.id === hoveredProject) || null}
              className="border-0 shadow-none max-w-full overflow-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
