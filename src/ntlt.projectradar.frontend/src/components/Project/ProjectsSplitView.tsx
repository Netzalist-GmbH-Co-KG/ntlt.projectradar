/**
 * ProjectsSplitView Component - Main layout for project management
 * Split layout: ProjectList (left) + ProjectDetails (right)
 */

'use client';

import { useProjects, useProjectDetail } from '../../hooks/useProjects';
import { ProjectUpdateFormData } from '../../types/project';
import { Breadcrumb } from '../Navigation/Breadcrumb';
import ProjectList from './ProjectList';
import { ProjectDetails } from './ProjectDetails';
import ProjectDetailStates from './ProjectDetailStates';

interface ProjectsSplitViewProps {
  selectedProjectId?: string;
}

export default function ProjectsSplitView({ selectedProjectId }: ProjectsSplitViewProps) {
  const { filteredProjects, isLoading: projectsLoading, error: projectsError, updateProject } = useProjects();
  const { 
    project: selectedProject, 
    isLoading: projectLoading, 
    error: projectError,
    saveProject 
  } = useProjectDetail(selectedProjectId);

  const breadcrumbItems = [
    { label: 'Projects', href: '/projects' }
  ];
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

  return (
    <div className="h-full flex flex-col bg-neutral-50">
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
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Project List - Left Panel (1/3) */}
        <div className="w-1/3 border-r border-neutral-200 bg-white flex flex-col">
          {projectsError && (
            <div className="p-4 bg-red-50 border-b border-red-200 flex-shrink-0">
              <p className="text-sm text-red-600">{projectsError}</p>
            </div>
          )}
          
          <ProjectList
            projects={filteredProjects}
            selectedProjectId={selectedProjectId}
            isLoading={projectsLoading}
          />
        </div>

        {/* Project Details - Right Panel (2/3) */}
        <div className="flex-1 bg-white min-w-0 flex flex-col">
          {projectError && (
            <div className="p-4 bg-red-50 border-b border-red-200 flex-shrink-0">
              <p className="text-sm text-red-600">{projectError}</p>
            </div>
          )}
          
          <div className="flex-1 p-6">
            {projectLoading ? (
              <ProjectDetailStates type="loading" />
            ) : projectError ? (
              <ProjectDetailStates type="error" error={projectError} />
            ) : selectedProject ? (
              <ProjectDetails
                project={selectedProject}
                onUpdateProject={handleUpdateProject}
              />
            ) : (
              <ProjectDetailStates type="no-selection" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
