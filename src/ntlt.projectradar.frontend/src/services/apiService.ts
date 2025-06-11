// API configuration and types
// Priority: Aspire Service Discovery, then BACKEND_URL, then fallback
const getApiBaseUrl = (): string => {
  // Check for Aspire service discovery first
  if (process.env.PORT) {
    return process.env.PORT;
  }
  
  // Check for explicit backend URL (standalone mode)
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  
  // Fallback for development
  return 'http://localhost:5100';
};

const API_BASE_URL = getApiBaseUrl();

export interface RawLead {
  id: string;
  originalContent: string;
  uploadedAt: string;
  processingStatus: 'Processing' | 'Completed' | 'Failed';
}

// Email-related interfaces
export interface EmailAttachmentListDto {
  id: string;
  attachmentFilename: string;
  attachmentMimeType: string;
}

export interface EmailListDto {
  id: string;
  emailFrom: string;
  emailTo: string;
  emailSubject: string;
  emailDate: string | null;
  createdAt: string;
  hasAttachments: boolean;
  attachments: EmailAttachmentListDto[];
}

export interface EmailListResponseDto {
  emails: EmailListDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EmailAttachmentDto {
  id: string;
  attachmentFilename: string;
  attachmentMimeType: string;
  attachmentContent: string;
  createdAt: string;
}

export interface EmailDetailsDto {
  id: string;
  rawLeadId: string;
  emailFrom: string;
  emailTo: string;
  emailSubject: string;
  emailDate: string | null;
  emailBodyText: string;
  emailBodyHtml: string;
  createdAt: string;
  attachments: EmailAttachmentDto[];
}

// Project-related interfaces
export interface ProjectDetailsDto {
  id: string;
  title: string | null;
  description: string | null;
  clientName: string | null;
  agencyName: string | null;
  contactEmail: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  timeline: string | null;
  technologies: string[];
  createdAt: string;
}

export interface CreateProjectDetailsDto {
  title: string | null;
  description: string | null;
  clientName: string | null;
  agencyName: string | null;
  contactEmail: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  timeline: string | null;
  technologies: string[];
}

export interface UpdateProjectDetailsDto {
  title: string | null;
  description: string | null;
  clientName: string | null;
  agencyName: string | null;
  contactEmail: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  timeline: string | null;
  technologies: string[];
}

export interface ProjectEmailLinkDto {
  projectId: string;
  emailId: string;
}

export interface ApiError {
  error: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UploadResponse extends RawLead {}

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async uploadEmlFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/rawleads/upload`, {
      method: 'POST',
      body: formData, // Don't set Content-Type for FormData - browser will set it with boundary
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    return response.json();
  }

  async getRawLead(id: string): Promise<RawLead> {
    return this.fetchWithErrorHandling<RawLead>(`${API_BASE_URL}/api/rawleads/${id}`);
  }

  async getRawLeads(status?: string): Promise<RawLead[]> {
    const url = new URL(`${API_BASE_URL}/api/rawleads`);
    if (status) {
      url.searchParams.append('status', status);
    }
    return this.fetchWithErrorHandling<RawLead[]>(url.toString());
  }
  async updateProcessingStatus(
    id: string,
    status: 'Processing' | 'Completed' | 'Failed'
  ): Promise<void> {
    await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/api/rawleads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteRawLead(id: string): Promise<void> {
    await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/api/rawleads/${id}`, {
      method: 'DELETE',
    });
  }

  // Email API methods
  async getEmails(page: number = 1, pageSize: number = 100): Promise<EmailListResponseDto> {
    const url = new URL(`${API_BASE_URL}/api/emails`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('pageSize', pageSize.toString());
    
    return this.fetchWithErrorHandling<EmailListResponseDto>(url.toString());
  }

  async getEmailById(id: string): Promise<EmailDetailsDto> {
    return this.fetchWithErrorHandling<EmailDetailsDto>(`${API_BASE_URL}/api/emails/${id}`);
  }

  async downloadAttachment(attachmentId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/emails/attachments/${attachmentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || `Download failed with status ${response.status}`);
    }

    return response.blob();
  }
  // Helper method to download attachment with proper filename
  async downloadAttachmentAsFile(attachmentId: string, filename: string): Promise<void> {
    try {
      const blob = await this.downloadAttachment(attachmentId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  // Project API methods
  async getProjects(): Promise<ProjectDetailsDto[]> {
    return this.fetchWithErrorHandling<ProjectDetailsDto[]>(`${API_BASE_URL}/api/projects`);
  }

  async getProjectById(id: string): Promise<ProjectDetailsDto> {
    return this.fetchWithErrorHandling<ProjectDetailsDto>(`${API_BASE_URL}/api/projects/${id}`);
  }

  async createProject(project: CreateProjectDetailsDto): Promise<ProjectDetailsDto> {
    return this.fetchWithErrorHandling<ProjectDetailsDto>(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: UpdateProjectDetailsDto): Promise<ProjectDetailsDto> {
    return this.fetchWithErrorHandling<ProjectDetailsDto>(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectsByEmail(emailId: string): Promise<ProjectDetailsDto[]> {
    return this.fetchWithErrorHandling<ProjectDetailsDto[]>(`${API_BASE_URL}/api/projects/by-email/${emailId}`);
  }

  async linkEmailToProject(projectId: string, emailId: string): Promise<void> {
    await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/api/projects/${projectId}/emails/${emailId}`, {
      method: 'POST',
    });
  }

  async unlinkEmailFromProject(projectId: string, emailId: string): Promise<void> {
    await this.fetchWithErrorHandling<void>(`${API_BASE_URL}/api/projects/${projectId}/emails/${emailId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
