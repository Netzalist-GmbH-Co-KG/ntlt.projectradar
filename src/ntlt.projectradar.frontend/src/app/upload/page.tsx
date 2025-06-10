'use client';

import { Breadcrumb } from '../../components/Navigation/Breadcrumb';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FileDropZone } from '../../components/Upload/FileDropZone';
import { UploadProgress } from '../../components/Upload/UploadProgress';
import { UploadError } from '../../components/Upload/UploadError';
import { UploadInstructions } from '../../components/Upload/UploadInstructions';

export default function UploadPage() {
  const {
    uploadState,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    resetUploadState,
  } = useFileUpload();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb />
      </div>

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
        {!uploadState.isUploading ? (
          <FileDropZone
            isDragOver={uploadState.isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
          />
        ) : (
          <UploadProgress
            uploadProgress={uploadState.uploadProgress}
            uploadedFilesCount={uploadState.uploadedFiles.length}
            uploadResults={uploadState.uploadResults}
          />
        )}

        {/* Error State */}
        {uploadState.error && (
          <UploadError
            error={uploadState.error}
            onRetry={resetUploadState}
          />
        )}
      </div>

      <UploadInstructions />
    </div>
  );
}
