export function UploadInstructions() {
  return (
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
  );
}
