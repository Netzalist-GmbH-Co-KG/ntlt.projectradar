/**
 * Frontend-specific project types and interfaces
 * These extend the API DTOs with additional frontend state and computed properties
 */

import type { ProjectDetailsDto, CreateProjectDetailsDto, UpdateProjectDetailsDto } from '../services/apiService';

// Re-export API DTOs for convenience
export type { ProjectDetailsDto, CreateProjectDetailsDto, UpdateProjectDetailsDto };

/**
 * Frontend project interface with additional computed properties
 */
export interface Project extends Omit<ProjectDetailsDto, 'id' | 'createdAt'> {
  id: string;
  createdAt: Date;
  
  // Computed properties
  budgetRange?: string;
  technologiesDisplay?: string;
  timelineDisplay?: string;
  
  // Frontend state
  isEditing?: boolean;
  isLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

/**
 * Project creation form data
 */
export interface ProjectFormData extends Omit<CreateProjectDetailsDto, 'technologies'> {
  technologies: string[];
}

/**
 * Project update form data
 */
export interface ProjectUpdateFormData extends Omit<UpdateProjectDetailsDto, 'technologies'> {
  technologies: string[];
}

/**
 * Project list view modes
 */
export type ProjectViewMode = 'list' | 'grid' | 'detail';

/**
 * Project sorting options
 */
export type ProjectSortField = 'title' | 'clientName' | 'createdAt' | 'timeline' | 'budgetMax';
export type ProjectSortDirection = 'asc' | 'desc';

export interface ProjectSortConfig {
  field: ProjectSortField;
  direction: ProjectSortDirection;
}

/**
 * Project filtering options
 */
export interface ProjectFilters {
  searchTerm?: string;
  clientName?: string;
  agencyName?: string;
  technologies?: string[];
  budgetRange?: {
    min?: number;
    max?: number;
  };
  timeline?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

/**
 * Project list state for components
 */
export interface ProjectListState {
  projects: Project[];
  selectedProject?: Project;
  isLoading: boolean;
  error?: string;
  viewMode: ProjectViewMode;
  sortConfig: ProjectSortConfig;
  filters: ProjectFilters;
  
  // Pagination (if needed in future)
  page: number;
  pageSize: number;
  totalCount: number;
}

/**
 * Project detail state for components
 */
export interface ProjectDetailState {
  project?: Project;
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  error?: string;
  hasUnsavedChanges: boolean;
  
  // Related data
  linkedEmails?: string[]; // Email IDs
  availableEmails?: string[]; // Email IDs
}

/**
 * Project validation errors
 */
export interface ProjectValidationErrors {
  title?: string;
  description?: string;
  clientName?: string;
  agencyName?: string;
  contactEmail?: string;
  budgetMin?: string;
  budgetMax?: string;
  timeline?: string;
  technologies?: string;
}

/**
 * Utility functions for project data transformation
 */
export const ProjectUtils = {
  /**
   * Convert ProjectDetailsDto to frontend Project interface
   */
  fromDto(dto: ProjectDetailsDto): Project {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
      budgetRange: ProjectUtils.formatBudgetRange(dto.budgetMin, dto.budgetMax),
      technologiesDisplay: dto.technologies.join(', '),
      timelineDisplay: dto.timeline || 'Not specified',
    };
  },

  /**
   * Convert frontend Project to UpdateProjectDetailsDto
   */
  toUpdateDto(project: Project): UpdateProjectDetailsDto {
    return {
      title: project.title,
      description: project.description,
      clientName: project.clientName,
      agencyName: project.agencyName,
      contactEmail: project.contactEmail,
      budgetMin: project.budgetMin,
      budgetMax: project.budgetMax,
      timeline: project.timeline,
      technologies: project.technologies,
    };
  },

  /**
   * Convert ProjectFormData to CreateProjectDetailsDto
   */
  fromFormData(formData: ProjectFormData): CreateProjectDetailsDto {
    return {
      title: formData.title,
      description: formData.description,
      clientName: formData.clientName,
      agencyName: formData.agencyName,
      contactEmail: formData.contactEmail,
      budgetMin: formData.budgetMin,
      budgetMax: formData.budgetMax,
      timeline: formData.timeline,
      technologies: formData.technologies,
    };
  },

  /**
   * Format budget range for display
   */
  formatBudgetRange(min?: number | null, max?: number | null): string {
    if (!min && !max) return 'Budget not specified';
    if (min && !max) return `From €${min.toLocaleString()}`;
    if (!min && max) return `Up to €${max.toLocaleString()}`;
    return `€${min!.toLocaleString()} - €${max!.toLocaleString()}`;
  },

  /**
   * Format currency value
   */
  formatCurrency(value?: number | null): string {
    return value ? `€${value.toLocaleString()}` : '';
  },

  /**
   * Validate email format
   */
  isValidEmail(email?: string | null): boolean {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate project form data
   */
  validateProject(project: Partial<ProjectFormData>): ProjectValidationErrors {
    const errors: ProjectValidationErrors = {};

    if (!project.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (project.contactEmail && !ProjectUtils.isValidEmail(project.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    if (project.budgetMin !== undefined && project.budgetMin !== null && project.budgetMin < 0) {
      errors.budgetMin = 'Budget minimum cannot be negative';
    }

    if (project.budgetMax !== undefined && project.budgetMax !== null && project.budgetMax < 0) {
      errors.budgetMax = 'Budget maximum cannot be negative';
    }

    if (
      project.budgetMin !== undefined && project.budgetMin !== null &&
      project.budgetMax !== undefined && project.budgetMax !== null &&
      project.budgetMin > project.budgetMax
    ) {
      errors.budgetMax = 'Budget maximum must be greater than minimum';
    }

    return errors;
  },

  /**
   * Check if project has validation errors
   */
  hasValidationErrors(errors: ProjectValidationErrors): boolean {
    return Object.keys(errors).length > 0;
  },

  /**
   * Create empty project form data
   */
  createEmptyFormData(): ProjectFormData {
    return {
      title: '',
      description: '',
      clientName: '',
      agencyName: '',
      contactEmail: '',
      budgetMin: null,
      budgetMax: null,
      timeline: '',
      technologies: [],
    };
  },

  /**
   * Check if two projects are equal (for change detection)
   */
  areProjectsEqual(a?: Project, b?: Project): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;

    return (
      a.id === b.id &&
      a.title === b.title &&
      a.description === b.description &&
      a.clientName === b.clientName &&
      a.agencyName === b.agencyName &&
      a.contactEmail === b.contactEmail &&
      a.budgetMin === b.budgetMin &&
      a.budgetMax === b.budgetMax &&
      a.timeline === b.timeline &&
      JSON.stringify(a.technologies) === JSON.stringify(b.technologies)
    );
  }
};
