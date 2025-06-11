/**
 * EmailDetailError Component - Error States for EmailDetail
 */

'use client';

interface EmailDetailErrorProps {
  error: string;
}

export default function EmailDetailError({ error }: EmailDetailErrorProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Fehler beim Laden
        </h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <p className="text-neutral-600 text-sm">
          Die E-Mail-Details konnten nicht geladen werden.
        </p>
      </div>
    </div>
  );
}
