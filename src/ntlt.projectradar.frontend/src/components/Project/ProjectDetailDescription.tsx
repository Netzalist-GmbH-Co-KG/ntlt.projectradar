/**
 * ProjectDetailDescription Component - Description section
 */

'use client';

interface ProjectDetailDescriptionProps {
  description: string | null;
}

export default function ProjectDetailDescription({ description }: ProjectDetailDescriptionProps) {
  if (!description) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-900 mb-2">Description</h3>
      <p className="text-neutral-700 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
