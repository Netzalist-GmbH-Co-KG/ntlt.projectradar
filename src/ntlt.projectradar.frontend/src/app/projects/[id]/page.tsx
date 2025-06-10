'use client';

import { useParams } from 'next/navigation';
import { useApp } from '../../../contexts/AppContext';
import { ProjectBreadcrumb } from '../../../components/Navigation/Breadcrumb';

export default function ProjectDetailPage() {
  const params = useParams();
  const { state } = useApp();
  const { projects } = state;
  
  const projectId = params.id as string;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <ProjectBreadcrumb />
        </div>
        
        <div className="text-center py-12">
          <div className="text-4xl text-neutral-400 mb-4">❌</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Project Not Found</h1>
          <p className="text-neutral-600 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <a 
            href="/projects"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'completed':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'archived':
        return 'text-gray-700 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb with project context */}
      <div className="mb-6">
        <ProjectBreadcrumb 
          projectName={project.name}
          projectId={project.id}
        />
      </div>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {project.name}
            </h1>
            <p className="text-lg text-neutral-600">
              {project.description}
            </p>
          </div>
          
          <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="font-medium text-neutral-700">Created:</span>
            <span className="ml-2 text-neutral-600">{project.createdAt}</span>
          </div>
          <div>
            <span className="font-medium text-neutral-700">Last Updated:</span>
            <span className="ml-2 text-neutral-600">{project.updatedAt}</span>
          </div>
          <div>
            <span className="font-medium text-neutral-700">Project ID:</span>
            <span className="ml-2 text-neutral-600 font-mono">{project.id}</span>
          </div>
          <div>
            <span className="font-medium text-neutral-700">Status:</span>
            <span className="ml-2 text-neutral-600">{project.status}</span>
          </div>
        </div>
      </div>

      {/* Project Tabs/Sections */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            <button className="border-b-2 border-primary-600 text-primary-600 py-4 px-1 text-sm font-medium">
              Overview
            </button>
            <button className="border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 py-4 px-1 text-sm font-medium">
              Details
            </button>
            <button className="border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 py-4 px-1 text-sm font-medium">
              Timeline
            </button>
            <button className="border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 py-4 px-1 text-sm font-medium">
              Files
            </button>
          </nav>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Project Overview</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Description</h4>
              <p className="text-neutral-600">{project.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Key Information</h4>
              <div className="bg-neutral-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-neutral-600">Project Type:</span>
                    <span className="text-neutral-900">Software Development</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-neutral-600">Priority:</span>
                    <span className="text-neutral-900">High</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-neutral-600">Estimated Duration:</span>
                    <span className="text-neutral-900">3-6 months</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-neutral-600">Source:</span>
                    <span className="text-neutral-900">Email Extraction</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Actions</h4>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Update Status
                </button>
                <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors">
                  Export Details
                </button>
                <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors">
                  Add Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
