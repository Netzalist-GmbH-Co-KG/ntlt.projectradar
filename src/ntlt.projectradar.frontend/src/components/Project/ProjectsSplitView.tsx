/**
 * ProjectsSplitView Component - Main layout for project management
 * Split layout: ProjectList (left) + ProjectDetails (right)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects, useProjectDetail } from '../../hooks/useProjects';
import { Project, ProjectUpdateFormData } from '../../types/project';
import { Breadcrumb } from '../Navigation/Breadcrumb';
import ProjectList from './ProjectList';
import { ProjectDetails } from './ProjectDetails';
import ProjectDetailStates from './ProjectDetailStates';
import ResizableSplit from '../Layout/ResizableSplit';

interface ProjectsSplitViewProps {
  selectedProjectId?: string;
  onProjectIdChange?: (projectId: string | undefined) => void;
}

export default function ProjectsSplitView({ selectedProjectId, onProjectIdChange }: ProjectsSplitViewProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { filteredProjects, isLoading: projectsLoading, error: projectsError, updateProject, updateProjectStatus } = useProjects();
  const { 
    project: projectDetails, 
    isLoading: projectLoading, 
    error: projectError,
    saveProject 
  } = useProjectDetail(selectedProjectId);

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' }
  ];
  // Find and set selected project when projectId changes or projects load
  useEffect(() => {
    if (selectedProjectId && filteredProjects.length > 0) {
      const project = filteredProjects.find(p => p.id === selectedProjectId);
      if (project && (!selectedProject || selectedProject.id !== project.id)) {
        // Only update if we found a different project
        setSelectedProject(project);
      } else if (!project && (!selectedProject || selectedProject.id !== selectedProjectId)) {
        // Project not found in current list, but we still want to show it's selected
        // The ProjectDetails component will handle the loading/error states
        setSelectedProject({ id: selectedProjectId } as Project);
      }
    } else if (!selectedProjectId && selectedProject) {
      setSelectedProject(null);
    }
  }, [selectedProjectId, filteredProjects]); // Removed selectedProject from deps to prevent loops

  // Auto-select first project if none is selected and projects are available
  useEffect(() => {
    if (!selectedProjectId && !selectedProject && filteredProjects.length > 0 && !projectsLoading) {
      const firstProject = filteredProjects[0];
      setSelectedProject(firstProject);
      
      // Update URL to reflect the selection
      if (onProjectIdChange) {
        setTimeout(() => {
          onProjectIdChange(firstProject.id);
        }, 0);
      }
    }
  }, [selectedProjectId, selectedProject, filteredProjects, projectsLoading, onProjectIdChange]);

  // Handle project selection with smooth transitions
  const handleProjectSelect = (project: Project) => {
    // Optimistic update: set project immediately for smooth UX
    setSelectedProject(project);
    
    // Notify parent component to update URL without page reload
    if (onProjectIdChange) {
      // Use setTimeout to ensure state update happens first
      setTimeout(() => {
        onProjectIdChange(project.id);
      }, 0);
    } else {
      // Fallback: use Next.js router if no callback provided
      router.push(`/projects/${project.id}`, { scroll: false });
    }
  };
  // Handle project update with optimistic UI
  const handleUpdateProject = async (id: string, data: ProjectUpdateFormData): Promise<boolean> => {
    try {
      const success = await saveProject(data);
      if (success) {
        // Also update the main projects list
        await updateProject(id, data);
      }
      return success;
    } catch (error) {
      console.error('Failed to update project:', error);
      return false;
    }
  };
  // Handle project status update
  const handleProjectStatusUpdate = (updatedProject: Project) => {
    // Update the selected project immediately for UI responsiveness
    setSelectedProject(updatedProject);
    
    // Also update the project in the main list using the hook function
    updateProjectStatus(updatedProject);
  };return (
    <div className="h-full flex flex-col bg-neutral-50" style={{ height: 'calc(100vh - 4rem - 3rem)' }}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-2xl font-semibold text-neutral-900 mt-2">
              Projects
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage and view all project opportunities from various sources
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>      {/* Main Content - Split Layout */}
      <div className="flex-1 min-h-0">
        <ResizableSplit 
          useFixedWidth={true}
          initialLeftWidth={400} 
          minLeftWidth={300} 
          maxLeftWidth={600}
        >
          {/* Project List - Left Panel */}
          <div className="bg-white flex flex-col h-full">
            {projectsError && (
              <div className="p-4 bg-red-50 border-b border-red-200 flex-shrink-0">
                <p className="text-sm text-red-600">{projectsError}</p>
              </div>
            )}            <ProjectList
              projects={filteredProjects}
              selectedProjectId={selectedProject?.id}
              onProjectSelect={handleProjectSelect}
              isLoading={projectsLoading}            />
          </div>

          {/* Project Details - Right Panel */}
          <div className="bg-white flex flex-col h-full">
            <ProjectDetails
              project={selectedProject}
              isLoading={projectLoading}
              error={projectError}
              onUpdateProject={handleUpdateProject}
              onProjectStatusUpdate={handleProjectStatusUpdate}
            />
          </div>
        </ResizableSplit>
      </div>
    </div>
  );
}
