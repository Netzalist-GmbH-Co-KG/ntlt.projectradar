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
export interface Project extends Omit<ProjectDetailsDto, 'id' | 'createdAt' | 'currentStatus'> {
  id: string;
  createdAt: Date;
  currentStatus: ProjectStatus;
  
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
   * Convert numerical status from DTO to ProjectStatus enum string value
   */
  mapDtoStatusToEnum(dtoStatus: any): ProjectStatus { // Accept 'any' to handle potential backend type, will be treated as number
    const statusMap: { [key: number]: ProjectStatus } = {
      0: ProjectStatus.New,
      1: ProjectStatus.InterestingCold,
      2: ProjectStatus.InterestingContacted,
      3: ProjectStatus.InterestingInProgress,
      4: ProjectStatus.NotInteresting,
      5: ProjectStatus.Won,
      6: ProjectStatus.Lost,
      7: ProjectStatus.MissedOpportunity,
    };
    // Ensure dtoStatus is treated as a number for the lookup
    const numericStatus = Number(dtoStatus);
    return statusMap[numericStatus] || ProjectStatus.New; // Default to New if mapping is not found or status is invalid
  },

  /**
   * Convert ProjectDetailsDto to frontend Project interface
   */
  fromDto(dto: ProjectDetailsDto): Project {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
      // Ensure dto.currentStatus is passed to mapDtoStatusToEnum
      currentStatus: ProjectUtils.mapDtoStatusToEnum(dto.currentStatus),
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

// Add ProjectStatus Enum
export enum ProjectStatus {
  New = 'New',
  InterestingCold = 'InterestingCold',
  InterestingContacted = 'InterestingContacted',
  InterestingInProgress = 'InterestingInProgress',
  NotInteresting = 'NotInteresting',
  Won = 'Won',
  Lost = 'Lost',
  MissedOpportunity = 'MissedOpportunity',
}

/**
 * Utility functions for project status management
 */
export const ProjectStatusUtils = {
  /**
   * Get all available status transitions from the current status
   */
  getAvailableStatusTransitions(currentStatus: ProjectStatus): ProjectStatus[] {
    const availableStatuses: ProjectStatus[] = [];

    // Same status is always allowed (no change)
    availableStatuses.push(currentStatus);

    // Direct to NotInteresting or MissedOpportunity from any 'Interesting' state or 'New'
    if (currentStatus === ProjectStatus.New ||
        currentStatus === ProjectStatus.InterestingCold ||
        currentStatus === ProjectStatus.InterestingContacted ||
        currentStatus === ProjectStatus.InterestingInProgress) {
      availableStatuses.push(ProjectStatus.NotInteresting, ProjectStatus.MissedOpportunity);
    }

    // From NotInteresting or MissedOpportunity back to an 'Interesting' state or 'New'
    if (currentStatus === ProjectStatus.NotInteresting || currentStatus === ProjectStatus.MissedOpportunity) {
      availableStatuses.push(
        ProjectStatus.New,
        ProjectStatus.InterestingCold,
        ProjectStatus.InterestingContacted,
        ProjectStatus.InterestingInProgress
      );
    }

    // Sequential "Interesting" flow
    const sequentialPath = [
      ProjectStatus.New,
      ProjectStatus.InterestingCold,
      ProjectStatus.InterestingContacted,
      ProjectStatus.InterestingInProgress
    ];

    const currentIndex = sequentialPath.indexOf(currentStatus);
    if (currentIndex !== -1) {
      // Allow one step forward
      if (currentIndex < sequentialPath.length - 1) {
        availableStatuses.push(sequentialPath[currentIndex + 1]);
      }
      // Allow one step backward
      if (currentIndex > 0) {
        availableStatuses.push(sequentialPath[currentIndex - 1]);
      }
    }

    // From InterestingInProgress to Won or Lost
    if (currentStatus === ProjectStatus.InterestingInProgress) {
      availableStatuses.push(ProjectStatus.Won, ProjectStatus.Lost);
    }

    // From Won/Lost back to InterestingInProgress (correction)
    if (currentStatus === ProjectStatus.Won || currentStatus === ProjectStatus.Lost) {
      availableStatuses.push(ProjectStatus.InterestingInProgress);
    }

    // Remove duplicates and return
    return Array.from(new Set(availableStatuses));
  },

  /**
   * Check if a comment is required for the given status
   */
  isCommentRequired(status: ProjectStatus): boolean {
    return status === ProjectStatus.Lost ||
           status === ProjectStatus.NotInteresting ||
           status === ProjectStatus.MissedOpportunity;
  },

  /**
   * Get German display text for status
   */
  getStatusDisplayText(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.New:
        return 'Neu';
      case ProjectStatus.InterestingCold:
        return 'Kaltakquise';
      case ProjectStatus.InterestingContacted:
        return 'Kontaktiert';
      case ProjectStatus.InterestingInProgress:
        return 'In Bearbeitung';
      case ProjectStatus.Won:
        return 'Gewonnen';
      case ProjectStatus.Lost:
        return 'Verloren';
      case ProjectStatus.NotInteresting:
        return 'Nicht Interessant';
      case ProjectStatus.MissedOpportunity:
        return 'Verpasst';
      default:
        return status;
    }
  },

  /**
   * Get color classes for status badge
   */
  getStatusColorClasses(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.New:
        return 'bg-blue-500 text-white border-blue-500';
      case ProjectStatus.InterestingCold:
        return 'bg-sky-500 text-white border-sky-500';
      case ProjectStatus.InterestingContacted:
        return 'bg-yellow-500 text-black border-yellow-500';
      case ProjectStatus.InterestingInProgress:
        return 'bg-orange-500 text-white border-orange-500';
      case ProjectStatus.Won:
        return 'bg-green-500 text-white border-green-500';
      case ProjectStatus.Lost:
        return 'bg-red-500 text-white border-red-500';
      case ProjectStatus.NotInteresting:
        return 'bg-gray-500 text-white border-gray-500';
      case ProjectStatus.MissedOpportunity:
        return 'bg-gray-500 text-white border-gray-500';
      default:
        return 'bg-gray-300 text-black border-gray-300';
    }
  }
};
