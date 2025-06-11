/**
 * EmailDetailMissing Component - Missing/Empty States for EmailDetail
 */

'use client';

interface EmailDetailMissingProps {
  type: 'no-selection' | 'not-found' | 'loading';
}

export default function EmailDetailMissing({ type }: EmailDetailMissingProps) {
  if (type === 'loading') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">E-Mail wird geladen...</p>
        </div>
      </div>
    );
  }

  if (type === 'not-found') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            E-Mail nicht gefunden
          </h3>
          <p className="text-neutral-600">
            Die E-Mail-Details sind nicht verfügbar.
          </p>
        </div>
      </div>
    );
  }

  // type === 'no-selection'
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Keine E-Mail ausgewählt
        </h3>
        <p className="text-neutral-600">
          Wählen Sie eine E-Mail aus der Liste aus, um die Details anzuzeigen.
        </p>
      </div>
    </div>
  );
}
