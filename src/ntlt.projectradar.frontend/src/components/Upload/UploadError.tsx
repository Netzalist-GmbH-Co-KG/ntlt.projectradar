interface UploadErrorProps {
  error: string;
  onRetry: () => void;
}

export function UploadError({ error, onRetry }: UploadErrorProps) {
  return (
    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <div className="text-red-400 mr-3">⚠️</div>
        <div>
          <h4 className="text-red-800 font-medium">Upload Error</h4>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="mt-3 px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
