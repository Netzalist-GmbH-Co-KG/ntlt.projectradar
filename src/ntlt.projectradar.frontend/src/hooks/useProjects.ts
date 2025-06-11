/**
 * Custom hooks for project data management
 * Provides reactive state management for projects with loading, error handling, and caching
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '../services/apiService';
import type {
  Project,
  ProjectFormData,
  ProjectUpdateFormData,
  ProjectListState,
  ProjectDetailState,
  ProjectSortConfig,
  ProjectFilters,
  ProjectViewMode,
  ProjectValidationErrors
} from '../types/project';
import { ProjectUtils } from '../types/project';

/**
 * Main hook for project list management
 */
export function useProjects() {
  const [state, setState] = useState<ProjectListState>({
    projects: [],
    isLoading: false,
    error: undefined,
    viewMode: 'list',
    sortConfig: { field: 'createdAt', direction: 'desc' },
    filters: {},
    page: 1,
    pageSize: 50,
    totalCount: 0,
  });

  // Load projects from API
  const loadProjects = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const projectDtos = await apiService.getProjects();
      const projects = projectDtos.map(ProjectUtils.fromDto);
      
      setState(prev => ({
        ...prev,
        projects,
        totalCount: projects.length,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to load projects:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load projects',
        isLoading: false,
      }));
    }
  }, []);

  // Create a new project
  const createProject = useCallback(async (formData: ProjectFormData): Promise<Project | null> => {
    try {
      const createDto = ProjectUtils.fromFormData(formData);
      const createdDto = await apiService.createProject(createDto);
      const newProject = ProjectUtils.fromDto(createdDto);
      
      setState(prev => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        totalCount: prev.totalCount + 1,
      }));
      
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create project',
      }));
      return null;
    }
  }, []);

  // Update an existing project
  const updateProject = useCallback(async (id: string, formData: ProjectUpdateFormData): Promise<Project | null> => {
    try {
      const updateDto = ProjectUtils.fromFormData(formData);
      const updatedDto = await apiService.updateProject(id, updateDto);
      const updatedProject = ProjectUtils.fromDto(updatedDto);
      
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === id ? updatedProject : p),
      }));
      
      return updatedProject;
    } catch (error) {
      console.error('Failed to update project:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update project',
      }));
      return null;
    }
  }, []);

  // Delete a project
  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      await apiService.deleteProject(id);
      
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id),
        totalCount: prev.totalCount - 1,
        selectedProject: prev.selectedProject?.id === id ? undefined : prev.selectedProject,
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete project',
      }));
      return false;
    }
  }, []);

  // Select a project
  const selectProject = useCallback((project?: Project) => {
    setState(prev => ({ ...prev, selectedProject: project }));
  }, []);

  // Update view mode
  const setViewMode = useCallback((viewMode: ProjectViewMode) => {
    setState(prev => ({ ...prev, viewMode }));
  }, []);

  // Update sort configuration
  const setSortConfig = useCallback((sortConfig: ProjectSortConfig) => {
    setState(prev => ({ ...prev, sortConfig }));
  }, []);

  // Update filters
  const setFilters = useCallback((filters: ProjectFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
  }, []);

  // Refresh projects
  const refresh = useCallback(() => {
    loadProjects();
  }, [loadProjects]);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Filtered and sorted projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...state.projects];

    // Apply filters
    if (state.filters.searchTerm) {
      const term = state.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        project.clientName?.toLowerCase().includes(term) ||
        project.agencyName?.toLowerCase().includes(term)
      );
    }

    if (state.filters.clientName) {
      filtered = filtered.filter(project =>
        project.clientName?.toLowerCase().includes(state.filters.clientName!.toLowerCase())
      );
    }

    if (state.filters.agencyName) {
      filtered = filtered.filter(project =>
        project.agencyName?.toLowerCase().includes(state.filters.agencyName!.toLowerCase())
      );
    }

    if (state.filters.technologies && state.filters.technologies.length > 0) {
      filtered = filtered.filter(project =>
        state.filters.technologies!.some(tech =>
          project.technologies.some(projectTech =>
            projectTech.toLowerCase().includes(tech.toLowerCase())
          )
        )
      );
    }

    if (state.filters.budgetRange) {
      filtered = filtered.filter(project => {
        const { min, max } = state.filters.budgetRange!;
        if (min && project.budgetMax && project.budgetMax < min) return false;
        if (max && project.budgetMin && project.budgetMin > max) return false;
        return true;
      });
    }

    if (state.filters.timeline) {
      filtered = filtered.filter(project =>
        project.timeline?.toLowerCase().includes(state.filters.timeline!.toLowerCase())
      );
    }

    if (state.filters.dateRange) {
      filtered = filtered.filter(project => {
        const { start, end } = state.filters.dateRange!;
        if (start && project.createdAt < start) return false;
        if (end && project.createdAt > end) return false;
        return true;
      });
    }    // Apply sorting
    filtered.sort((a, b) => {
      const { field, direction } = state.sortConfig;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any = a[field];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any = b[field];

      // Handle different data types
      if (field === 'createdAt') {
        aValue = (a.createdAt as Date).getTime();
        bValue = (b.createdAt as Date).getTime();
      } else if (typeof aValue === 'string') {
        aValue = (aValue as string)?.toLowerCase() || '';
        bValue = (bValue as string)?.toLowerCase() || '';
      } else if (typeof aValue === 'number') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [state.projects, state.filters, state.sortConfig]);

  return {
    // State
    ...state,
    filteredProjects: filteredAndSortedProjects,
    
    // Actions
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    setViewMode,
    setSortConfig,
    setFilters,
    clearError,
    refresh,
  };
}

/**
 * Hook for managing a single project's details
 */
export function useProjectDetail(projectId?: string) {
  const [state, setState] = useState<ProjectDetailState>({
    isLoading: false,
    isEditing: false,
    isSaving: false,
    error: undefined,
    hasUnsavedChanges: false,
  });

  // Load project details
  const loadProject = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const projectDto = await apiService.getProjectById(id);
      const project = ProjectUtils.fromDto(projectDto);
      
      setState(prev => ({
        ...prev,
        project,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to load project:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load project',
        isLoading: false,
      }));
    }
  }, []);

  // Save project changes
  const saveProject = useCallback(async (formData: ProjectUpdateFormData): Promise<boolean> => {
    if (!state.project) return false;
    
    setState(prev => ({ ...prev, isSaving: true, error: undefined }));
    
    try {
      const updateDto = ProjectUtils.fromFormData(formData);
      const updatedDto = await apiService.updateProject(state.project.id, updateDto);
      const updatedProject = ProjectUtils.fromDto(updatedDto);
      
      setState(prev => ({
        ...prev,
        project: updatedProject,
        isSaving: false,
        hasUnsavedChanges: false,
        isEditing: false,
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to save project',
        isSaving: false,
      }));
      return false;
    }
  }, [state.project]);

  // Toggle edit mode
  const setEditing = useCallback((editing: boolean) => {
    setState(prev => ({ ...prev, isEditing: editing }));
  }, []);

  // Set unsaved changes flag
  const setHasUnsavedChanges = useCallback((hasChanges: boolean) => {
    setState(prev => ({ ...prev, hasUnsavedChanges: hasChanges }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
  }, []);

  // Load project when ID changes
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      setState(prev => ({ ...prev, project: undefined }));
    }
  }, [projectId, loadProject]);

  return {
    // State
    ...state,
    
    // Actions
    loadProject,
    saveProject,
    setEditing,
    setHasUnsavedChanges,
    clearError,
  };
}

/**
 * Hook for project validation
 */
export function useProjectValidation() {
  const [errors, setErrors] = useState<ProjectValidationErrors>({});

  const validateProject = useCallback((project: Partial<ProjectFormData>): boolean => {
    const validationErrors = ProjectUtils.validateProject(project);
    setErrors(validationErrors);
    return !ProjectUtils.hasValidationErrors(validationErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field: keyof ProjectValidationErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateProject,
    clearErrors,
    clearError,
    hasErrors: ProjectUtils.hasValidationErrors(errors),
  };
}

/**
 * Hook for project email linking
 */
export function useProjectEmailLinks(projectId?: string) {
  const [linkedEmails, setLinkedEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const linkEmail = useCallback(async (emailId: string): Promise<boolean> => {
    if (!projectId) return false;
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      await apiService.linkEmailToProject(projectId, emailId);
      setLinkedEmails(prev => [...prev, emailId]);
      return true;
    } catch (error) {
      console.error('Failed to link email:', error);
      setError(error instanceof Error ? error.message : 'Failed to link email');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const unlinkEmail = useCallback(async (emailId: string): Promise<boolean> => {
    if (!projectId) return false;
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      await apiService.unlinkEmailFromProject(projectId, emailId);
      setLinkedEmails(prev => prev.filter(id => id !== emailId));
      return true;
    } catch (error) {
      console.error('Failed to unlink email:', error);
      setError(error instanceof Error ? error.message : 'Failed to unlink email');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return {
    linkedEmails,
    isLoading,
    error,
    linkEmail,
    unlinkEmail,
    clearError,
  };
}
