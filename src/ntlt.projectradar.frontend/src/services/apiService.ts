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
  processingStatus: 'New' | 'Processing' | 'Completed' | 'Failed';
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
    status: 'New' | 'Processing' | 'Completed' | 'Failed'
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
}

export const apiService = new ApiService();
