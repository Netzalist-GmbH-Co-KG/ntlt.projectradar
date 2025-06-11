/**
 * ProjectDetailDescription Component - Description section
 */

'use client';

interface ProjectDetailDescriptionProps {
  description: string | null;
}

export default function ProjectDetailDescription({ description }: ProjectDetailDescriptionProps) {
  if (!description) return null;  return (
    <div className="overflow-hidden">
      <div className="text-neutral-500 text-xs leading-relaxed break-words hyphens-auto overflow-wrap-break-word max-w-full">
        {description}
      </div>
    </div>
  );
}
