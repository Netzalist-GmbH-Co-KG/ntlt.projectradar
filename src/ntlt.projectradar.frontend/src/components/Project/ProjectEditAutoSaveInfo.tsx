/**
 * ProjectEditAutoSaveInfo Component - Auto-save information display
 */

'use client';

export default function ProjectEditAutoSaveInfo() {
  return (
    <div className="pt-4 border-t border-neutral-200">
      <p className="text-xs text-neutral-500">
        Changes are automatically saved as you type. No need to manually save.
      </p>
    </div>
  );
}
