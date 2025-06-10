import Link from "next/link";

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  retry, 
  className = '' 
}: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ErrorPageProps {
  title?: string;
  message?: string;
  retry?: () => void;
  goHome?: boolean;
}

export function ErrorPage({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  retry,
  goHome = true
}: ErrorPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-6xl text-red-400 mb-4">❌</div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h2>
        <p className="text-neutral-600 mb-6 text-center max-w-md">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {retry && (
            <button
              onClick={retry}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          )}
          {goHome && (
            <Link
              href="/"
              className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-center"
            >
              Go Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
