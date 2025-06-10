export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Upload Email
          </h1>
          <p className="text-lg text-neutral-600">
            Upload .eml files to extract project data automatically
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center hover:border-neutral-400 transition-colors">
            <div className="space-y-4">
              <div className="text-4xl text-neutral-400">📁</div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Drop .eml files here
                </h3>
                <p className="text-neutral-600 mb-4">
                  or click to browse files
                </p>
                <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors">
                  Browse Files
                </button>
              </div>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <h4 className="font-medium text-neutral-900 mb-2">Supported formats:</h4>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• .eml files (Email messages)</li>
              <li>• Files up to 10MB</li>
              <li>• Batch upload supported</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
