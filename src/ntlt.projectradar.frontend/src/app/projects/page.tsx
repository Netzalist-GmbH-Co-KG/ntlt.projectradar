'use client';

import { useEffect, useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { LoadingCard } from '../../components/Loading/LoadingComponents';
import { ErrorMessage } from '../../components/Error/ErrorComponents';

export default function ProjectsPage() {
  const { state, setLoading, addProject, setError } = useApp();
  const { projects, isLoading, error } = state;
  const [filter, setFilter] = useState('all');
  const hasInitializedRef = useRef(false);

  const loadMockData = () => {
    setError(null);
    setLoading(true);
    
    // Simulate API call with potential error
    setTimeout(() => {
      try {
        const mockProjects = [
          {
            id: '1',
            name: 'Website Redesign',
            status: 'active' as const,
            description: 'Complete redesign of company website with modern UI/UX',
            createdAt: '2024-01-15',
            updatedAt: '2024-06-10',
          },
          {
            id: '2',
            name: 'Mobile App Development',
            status: 'pending' as const,
            description: 'Native mobile application for iOS and Android',
            createdAt: '2024-02-01',
            updatedAt: '2024-06-08',
          },
          {
            id: '3',
            name: 'Database Migration',
            status: 'completed' as const,
            description: 'Migration from legacy database to PostgreSQL',
            createdAt: '2024-01-10',
            updatedAt: '2024-05-30',
          },
          {
            id: '4',
            name: 'API Documentation',
            status: 'archived' as const,
            description: 'Comprehensive API documentation and guides',
            createdAt: '2024-03-15',
            updatedAt: '2024-04-20',
          },
        ];

        mockProjects.forEach(project => addProject(project));
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    // Load mock data if no projects exist and not already initialized
    if (projects.length === 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      loadMockData();
    }
  }, []); // Empty dependency array!

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-neutral-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-5 bg-neutral-200 rounded w-96 animate-pulse" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
          <div className="h-8 bg-neutral-200 rounded w-32 animate-pulse" />
        </div>

        {/* Loading Cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Projects Overview
          </h1>
        </div>
        <ErrorMessage
          title="Failed to load projects"
          message={error}
          retry={loadMockData}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Projects Overview
        </h1>
        <p className="text-lg text-neutral-600">
          Manage all your projects in one place
        </p>
        <div className="mt-4 text-sm text-neutral-500">
          Total Projects: {projects.length}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-neutral-700">Status:</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-neutral-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="text-sm text-neutral-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-neutral-600 mb-3">{project.description}</p>
                
                <div className="space-y-1 text-sm text-neutral-500">
                  <p><span className="font-medium">Created:</span> {project.createdAt}</p>
                  <p><span className="font-medium">Last Updated:</span> {project.updatedAt}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors">
                  View Details
                </button>
                <button className="px-3 py-1 text-sm bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <div className="text-4xl text-neutral-400 mb-4">🔍</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No projects match your filter</h3>
          <p className="text-neutral-600">Try changing the status filter to see more projects</p>
        </div>
      )}

      {/* No projects at all */}
      {projects.length === 0 && !isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <div className="text-4xl text-neutral-400 mb-4">📋</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No projects yet</h3>
          <p className="text-neutral-600 mb-4">Upload your first .eml file to get started</p>
          <a href="/upload" className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors">
            Upload Email
          </a>
        </div>
      )}
    </div>
  );
}
