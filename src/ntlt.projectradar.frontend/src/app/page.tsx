'use client';

import { useApp } from '../contexts/AppContext';
import { ToastDemo } from '../components/Toast/ToastComponents';

export default function HomePage() {
  const { state } = useApp();
  const { projects } = state;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Project Radar
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              AI-powered project acquisition system for systematic lead management and opportunity tracking
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Email Processing
              </h3>
              <p className="text-neutral-600">
                Automatically extract project opportunities from .eml email files using AI
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Project Management
              </h3>
              <p className="text-neutral-600">
                Organize and track all extracted projects with status management and filtering
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Advanced Search
              </h3>
              <p className="text-neutral-600">
                Powerful search capabilities to find specific projects and opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Demo Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Toast Notifications Demo
            </h2>
            <p className="text-lg text-neutral-600">
              Test the toast notification system
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <ToastDemo />
          </div>
        </div>
      </section>

      {/* Design System Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Design System
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Colors */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Primary</h3>
              <div className="space-y-2">
                <div 
                  className="h-16 rounded-lg border border-neutral-200"
                  style={{ backgroundColor: '#3b82f6' }}
                />
                <p className="text-sm text-neutral-600">#3b82f6</p>
              </div>
            </div>
            
            {/* Success Colors */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Success</h3>
              <div className="space-y-2">
                <div 
                  className="h-16 rounded-lg border border-neutral-200"
                  style={{ backgroundColor: '#10b981' }}
                />
                <p className="text-sm text-neutral-600">#10b981</p>
              </div>
            </div>
            
            {/* Warning Colors */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Warning</h3>
              <div className="space-y-2">
                <div 
                  className="h-16 rounded-lg border border-neutral-200"
                  style={{ backgroundColor: '#f59e0b' }}
                />
                <p className="text-sm text-neutral-600">#f59e0b</p>
              </div>
            </div>
            
            {/* Neutral Colors */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Neutral</h3>
              <div className="space-y-2">
                <div 
                  className="h-16 rounded-lg border border-neutral-200"
                  style={{ backgroundColor: '#6b7280' }}
                />
                <p className="text-sm text-neutral-600">#6b7280</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            System Status
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-2xl text-green-600 mb-2">✅</div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">Frontend</h3>
              <p className="text-green-700">Online</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-2xl text-green-600 mb-2">✅</div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">Backend</h3>
              <p className="text-green-700">Online</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="text-2xl text-yellow-600 mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-1">AI Processing</h3>
              <p className="text-yellow-700">Development</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}