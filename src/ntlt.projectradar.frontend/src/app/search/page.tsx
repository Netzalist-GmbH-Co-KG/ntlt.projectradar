'use client';

import { Breadcrumb } from '../../components/Navigation/Breadcrumb';

export default function SearchPage() {  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Search Projects
          </h1>
          <p className="text-lg text-neutral-600">
            Find projects by technology, location, company, or keywords
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="space-y-4">
            {/* Main Search */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Search Query
              </label>
              <input 
                type="text" 
                placeholder="e.g. React, Berlin, Remote, Senior Developer..." 
                className="w-full border border-neutral-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Technology
                </label>
                <select className="w-full border border-neutral-300 rounded-md px-3 py-2">
                  <option>All Technologies</option>
                  <option>React</option>
                  <option>.NET</option>
                  <option>Node.js</option>
                  <option>Python</option>
                  <option>Vue.js</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location
                </label>
                <select className="w-full border border-neutral-300 rounded-md px-3 py-2">
                  <option>All Locations</option>
                  <option>Berlin</option>
                  <option>Munich</option>
                  <option>Hamburg</option>
                  <option>Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status
                </label>
                <select className="w-full border border-neutral-300 rounded-md px-3 py-2">
                  <option>All Status</option>
                  <option>New</option>
                  <option>Seen</option>
                  <option>Interesting</option>
                  <option>Not Relevant</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors">
                Search Projects
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
          <div className="text-4xl text-neutral-400 mb-4">🔍</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Start searching</h3>
          <p className="text-neutral-600">
            Enter your search criteria above to find relevant projects
          </p>
        </div>

        {/* Quick Search Tags */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Quick searches:</h4>
          <div className="flex flex-wrap gap-2">
            {['React', 'Remote', 'Berlin', 'Senior', '.NET', 'Frontend', 'Backend', 'Fullstack'].map((tag) => (
              <button 
                key={tag}
                className="px-3 py-1 text-sm bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>        </div>
    </div>
  );
}
