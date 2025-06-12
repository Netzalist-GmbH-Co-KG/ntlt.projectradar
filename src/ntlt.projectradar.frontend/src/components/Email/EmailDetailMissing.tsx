/**
 * EmailDetailMissing Component - Missing/Empty States for EmailDetail
 */

'use client';

interface EmailDetailMissingProps {
  type: 'no-selection' | 'not-found' | 'loading';
}

export default function EmailDetailMissing({ type }: EmailDetailMissingProps) {
  // Get content based on type
  const getContent = () => {
    if (type === 'loading') {
      return {
        icon: (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        ),
        title: 'E-Mail wird geladen...',
        description: 'Bitte warten Sie einen Moment.',
        bgColor: 'bg-blue-100'
      };
    }

    if (type === 'not-found') {
      return {
        icon: (
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        title: 'E-Mail nicht gefunden',
        description: 'Die E-Mail-Details sind nicht verfügbar.',
        bgColor: 'bg-yellow-100'
      };
    }

    // type === 'no-selection'
    return {
      icon: (
        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Keine E-Mail ausgewählt',
      description: 'Wählen Sie eine E-Mail aus der Liste aus, um die Details anzuzeigen.',
      bgColor: 'bg-neutral-100'
    };
  };

  const content = getContent();

  // Use the same layout structure as EmailDetail to prevent layout shifting
  return (
    <div className="h-full flex flex-col">
      {/* Header Section - matches EmailDetailHeader structure */}
      <div className="border-b border-neutral-200 p-6 bg-white flex-shrink-0">
        <div className="space-y-4">
          {/* Empty header space to match EmailDetailHeader height */}
          <div className="h-8"></div>
          <div className="h-16"></div>
        </div>
      </div>

      {/* Content Section - matches EmailDetailContent structure */}
      <div className="flex-1 email-detail-content bg-neutral-50">
        <div className="h-full p-6">
          <div className="bg-white rounded-lg border border-neutral-200 h-full flex items-center justify-center">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 ${content.bgColor} rounded-full flex items-center justify-center`}>
                {content.icon}
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {content.title}
              </h3>
              <p className="text-neutral-600">
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
