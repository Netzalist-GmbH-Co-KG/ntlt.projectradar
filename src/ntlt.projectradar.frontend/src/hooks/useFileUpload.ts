import { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { apiService } from '../services/apiService';

interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  isDragOver: boolean;
  uploadedFiles: File[];
  uploadResults: string[];
  error: string | null;
}

export function useFileUpload() {
  const { setError } = useApp();
  const { showSuccess, showError } = useToast();
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
    isDragOver: false,
    uploadedFiles: [],
    uploadResults: [],
    error: null,
  });

  const processFiles = useCallback(async (files: File[]) => {
    setUploadState(prev => ({ 
      ...prev, 
      isUploading: true, 
      uploadProgress: 0, 
      error: null,
      uploadedFiles: files,
      uploadResults: []
    }));    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Upload file to backend API
          const uploadResult = await apiService.uploadEmlFile(file);

          setUploadState(prev => ({
            ...prev,
            uploadProgress: ((i + 1) / files.length) * 100,
            uploadResults: [...prev.uploadResults, `✓ ${file.name} uploaded successfully (ID: ${uploadResult.id.substring(0, 8)}...)`]
          }));
          
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          setUploadState(prev => ({
            ...prev,
            uploadProgress: ((i + 1) / files.length) * 100,
            uploadResults: [...prev.uploadResults, `✗ ${file.name} failed: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`]
          }));
          
          // Show individual file error but continue with other files
          showError(
            'File Upload Failed',
            `Failed to upload ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`
          );
        }
      }

      // Complete upload and reset to initial state
      setTimeout(() => {
        showSuccess(
          'Upload Complete!', 
          `Successfully processed ${files.length} file(s) and extracted ${files.length} project(s)`,
          {
            action: {
              label: 'View Projects',
              onClick: () => window.location.href = '/projects'
            }
          }
        );
        
        // Reset to initial state after showing toast
        setUploadState({
          isUploading: false,
          uploadProgress: 0,
          isDragOver: false,
          uploadedFiles: [],
          uploadResults: [],
          error: null,
        });
      }, 500);
    } catch (error) {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: 'Failed to process files. Please try again.' 
      }));
      setError('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      
      showError(
        'Upload Failed', 
        'There was an error processing your files. Please try again.',
        {
          action: {
            label: 'Try Again',
            onClick: () => setUploadState({
              isUploading: false,
              uploadProgress: 0,
              isDragOver: false,
              uploadedFiles: [],
              uploadResults: [],
              error: null,
            })
          }
        }
      );
    }
  }, [showSuccess, showError, setError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, isDragOver: false }));
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.name.endsWith('.eml')
    );
    
    if (files.length > 0) {
      processFiles(files);
    } else {
      setUploadState(prev => ({ 
        ...prev, 
        error: 'Please upload only .eml files' 
      }));
      showError('Invalid File Type', 'Please upload only .eml files');
    }
  }, [processFiles, showError]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.name.endsWith('.eml')
    );
    
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      uploadProgress: 0,
      isDragOver: false,
      uploadedFiles: [],
      uploadResults: [],
      error: null,
    });
  }, []);

  return {
    uploadState,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    resetUploadState,
  };
}
