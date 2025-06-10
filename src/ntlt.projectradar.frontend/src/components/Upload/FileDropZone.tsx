interface FileDropZoneProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileDropZone({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: FileDropZoneProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragOver
          ? 'border-primary-400 bg-primary-50'
          : 'border-neutral-300 hover:border-neutral-400'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
            onChange={onFileSelect}
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
  );
}
