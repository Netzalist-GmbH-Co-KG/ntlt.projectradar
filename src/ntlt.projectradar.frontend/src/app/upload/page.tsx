'use client';

import { useState, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { LoadingSpinner } from '../../components/Loading/LoadingComponents';

interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  isDragOver: boolean;
  uploadedFiles: File[];
  uploadResults: string[];
  error: string | null;
}

export default function UploadPage() {
  const { addProject, setError } = useApp();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
    isDragOver: false,
    uploadedFiles: [],
    uploadResults: [],
    error: null,
  });

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
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.name.endsWith('.eml')
    );
    
    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  const processFiles = async (files: File[]) => {
    setUploadState(prev => ({ 
      ...prev, 
      isUploading: true, 
      uploadProgress: 0, 
      error: null,
      uploadedFiles: files,
      uploadResults: []
    }));

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Simulate project extraction
        const mockProject = {
          id: `proj-${Date.now()}-${i}`,
          name: `Project from ${file.name.replace('.eml', '')}`,
          status: 'pending' as const,
          description: `Extracted from email: ${file.name}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

        addProject(mockProject);
        
        setUploadState(prev => ({
          ...prev,
          uploadProgress: ((i + 1) / files.length) * 100,
          uploadResults: [...prev.uploadResults, `✓ ${file.name} processed successfully`]
        }));
      }      // Complete upload
      setTimeout(() => {
        setUploadState(prev => ({ 
          ...prev, 
          isUploading: false 
        }));
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
      }, 500);    } catch (error) {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: 'Failed to process files. Please try again.' 
      }));
      setError('Upload failed');
      showError(
        'Upload Failed', 
        'There was an error processing your files. Please try again.',
        {
          action: {
            label: 'Try Again',
            onClick: resetUpload
          }
        }
      );
    }
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      uploadProgress: 0,
      isDragOver: false,
      uploadedFiles: [],
      uploadResults: [],
      error: null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Upload Email Files
        </h1>
        <p className="text-lg text-neutral-600">
          Upload .eml files to automatically extract project opportunities
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
        {!uploadState.isUploading && uploadState.uploadResults.length === 0 ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              uploadState.isDragOver
                ? 'border-primary-400 bg-primary-50'
                : 'border-neutral-300 hover:border-neutral-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="text-4xl text-neutral-400">📁</div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Drop .eml files here
                </h3>
                <p className="text-neutral-600 mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  multiple
                  accept=".eml"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
              <div className="text-sm text-neutral-500">
                Supported format: .eml files only
              </div>
            </div>
          </div>
        ) : uploadState.isUploading ? (
          /* Upload Progress */
          <div className="text-center">
            <div className="mb-6">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Processing Files
              </h3>
              <p className="text-neutral-600">
                Extracting project data from {uploadState.uploadedFiles.length} file(s)...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.uploadProgress}%` }}
              />
            </div>

            <div className="text-sm text-neutral-600">
              {Math.round(uploadState.uploadProgress)}% complete
            </div>

            {/* Live Results */}
            {uploadState.uploadResults.length > 0 && (
              <div className="mt-6 text-left bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 mb-2">Processing Results:</h4>
                <div className="space-y-1">
                  {uploadState.uploadResults.map((result, index) => (
                    <div key={index} className="text-sm text-green-600">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Upload Complete */
          <div className="text-center">
            <div className="text-4xl text-green-500 mb-4">✅</div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Upload Complete!
            </h3>
            <p className="text-neutral-600 mb-6">
              Successfully processed {uploadState.uploadedFiles.length} file(s)
            </p>

            <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-medium text-neutral-900 mb-2">Results:</h4>
              <div className="space-y-1">
                {uploadState.uploadResults.map((result, index) => (
                  <div key={index} className="text-sm text-green-600">
                    {result}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetUpload}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
              >
                Upload More Files
              </button>
              <a
                href="/projects"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                View Projects
              </a>
            </div>
          </div>
        )}

        {/* Error State */}
        {uploadState.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h4 className="text-red-800 font-medium">Upload Error</h4>
                <p className="text-red-600 text-sm">{uploadState.error}</p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="mt-3 px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="mt-8 bg-neutral-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-3">
          How it works
        </h3>
        <div className="space-y-2 text-sm text-neutral-600">
          <div className="flex items-center">
            <span className="text-primary-600 mr-2">1.</span>
            Upload .eml email files containing project opportunities
          </div>
          <div className="flex items-center">
            <span className="text-primary-600 mr-2">2.</span>
            AI extracts relevant project information automatically
          </div>
          <div className="flex items-center">
            <span className="text-primary-600 mr-2">3.</span>
            Review and manage extracted projects in the Projects section
          </div>
        </div>
      </div>
    </div>
  );
}
