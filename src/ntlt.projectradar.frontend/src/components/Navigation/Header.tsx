'use client';

interface HeaderProps {
  // Future: currentPath for active navigation state
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Upload', href: '/upload' },
    { name: 'Projects', href: '/projects' },
    { name: 'Search', href: '/search' },
  ];

  return (
    <header className={`h-16 bg-white border-b border-neutral-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-neutral-900">
              Project Radar
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button (Placeholder for Step 4) */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
