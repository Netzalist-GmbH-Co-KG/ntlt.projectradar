'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if no items provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname);

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for root or single-level pages
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="h-4 w-4 text-neutral-400 mx-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              
              {isLast ? (
                <span className="text-neutral-900 font-medium flex items-center">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '/'}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: '🏠' }
  ];

  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    const label = getSegmentLabel(segment);
    const icon = getSegmentIcon(segment);
    
    breadcrumbs.push({
      label,
      href: index === pathSegments.length - 1 ? undefined : currentPath, // No href for last item
      icon
    });
  });

  return breadcrumbs;
}

function getSegmentLabel(segment: string): string {
  const labelMap: Record<string, string> = {
    'projects': 'Projects',
    'upload': 'Upload',
    'search': 'Search',
    'settings': 'Settings',
    'profile': 'Profile',
    'dashboard': 'Dashboard',
  };

  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

function getSegmentIcon(segment: string): string {
  const iconMap: Record<string, string> = {
    'projects': '📋',
    'upload': '📤',
    'search': '🔍',
    'settings': '⚙️',
    'profile': '👤',
    'dashboard': '📊',
  };

  return iconMap[segment] || '';
}

// Component for complex breadcrumb scenarios
interface PageBreadcrumbProps {
  title?: string;
  customItems?: BreadcrumbItem[];
  showTitle?: boolean;
  className?: string;
}

export function PageBreadcrumb({ 
  title, 
  customItems, 
  showTitle = true, 
  className = '' 
}: PageBreadcrumbProps) {
  const pathname = usePathname();
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Breadcrumb items={customItems} />
      
      {showTitle && title && (
        <h1 className="text-2xl font-bold text-neutral-900">
          {title}
        </h1>
      )}
    </div>
  );
}

// Breadcrumb for project detail pages
interface ProjectBreadcrumbProps {
  projectName?: string;
  projectId?: string;
  section?: string;
  className?: string;
}

export function ProjectBreadcrumb({ 
  projectName, 
  projectId, 
  section, 
  className = '' 
}: ProjectBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Projects', href: '/projects', icon: '📋' },
  ];

  if (projectName) {
    items.push({
      label: projectName,
      href: projectId ? `/projects/${projectId}` : undefined,
      icon: '📁'
    });
  }

  if (section) {
    items.push({
      label: section,
      icon: '📄'
    });
  }

  return <Breadcrumb items={items} className={className} />;
}

// Demo component for testing breadcrumbs
export function BreadcrumbDemo() {
  const customItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Projects', href: '/projects', icon: '📋' },
    { label: 'Website Redesign', href: '/projects/1', icon: '📁' },
    { label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-neutral-200">
      <h3 className="text-lg font-medium text-neutral-900">Breadcrumb Navigation Demo</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Auto-generated from URL:</h4>
          <div className="bg-neutral-50 p-3 rounded">
            <Breadcrumb />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Custom breadcrumb:</h4>
          <div className="bg-neutral-50 p-3 rounded">
            <Breadcrumb items={customItems} />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Project breadcrumb:</h4>
          <div className="bg-neutral-50 p-3 rounded">
            <ProjectBreadcrumb 
              projectName="Website Redesign" 
              projectId="1" 
              section="Details" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
