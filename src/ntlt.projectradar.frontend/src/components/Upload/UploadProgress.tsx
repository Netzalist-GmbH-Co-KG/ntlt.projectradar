import { LoadingSpinner } from '../Loading/LoadingComponents';

interface UploadProgressProps {
  uploadProgress: number;
  uploadedFilesCount: number;
  uploadResults: string[];
}

export function UploadProgress({
  uploadProgress,
  uploadedFilesCount,
  uploadResults,
}: UploadProgressProps) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Processing Files
        </h3>
        <p className="text-neutral-600">
          Extracting project data from {uploadedFilesCount} file(s)...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>

      <div className="text-sm text-neutral-600">
        {Math.round(uploadProgress)}% complete
      </div>

      {/* Live Results */}
      {uploadResults.length > 0 && (
        <div className="mt-6 text-left bg-neutral-50 rounded-lg p-4">
          <h4 className="font-medium text-neutral-900 mb-2">Processing Results:</h4>
          <div className="space-y-1">
            {uploadResults.map((result, index) => (
              <div key={index} className="text-sm text-green-600">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
