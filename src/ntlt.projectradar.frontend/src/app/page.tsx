export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Welcome to Project Radar
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            AI-powered project acquisition system for systematic lead management
          </p>
          
          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="text-2xl font-semibold text-green-600 mb-2">
                Layout ✓
              </div>
              <p className="text-neutral-600">
                Basic app structure with Tailwind CSS
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="text-2xl font-semibold text-green-600 mb-2">
                Navigation ✓
              </div>
              <p className="text-neutral-600">
                Clean desktop header navigation
              </p>
            </div>
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="text-2xl font-semibold text-neutral-400 mb-2">
                Pages
              </div>
              <p className="text-neutral-600">
                Coming in Step 3
              </p>
            </div>
          </div>
        </div>

        {/* Design System Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            Design System Preview
          </h2>
            {/* Color Palette */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-neutral-700 mb-4">Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#3b82f6'}}></div>
                <p className="text-sm text-neutral-600">Primary</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#10b981'}}></div>
                <p className="text-sm text-neutral-600">Success</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#f59e0b'}}></div>
                <p className="text-sm text-neutral-600">Warning</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#6b7280'}}></div>
                <p className="text-sm text-neutral-600">Neutral</p>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-lg font-medium text-neutral-700 mb-4">Typography</h3>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-neutral-900">Heading 1 - Inter Bold</h1>
              <h2 className="text-2xl font-semibold text-neutral-800">Heading 2 - Inter Semibold</h2>
              <p className="text-base text-neutral-700">Body text - Inter Regular</p>
              <p className="text-sm text-neutral-600">Small text - Inter Regular</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}