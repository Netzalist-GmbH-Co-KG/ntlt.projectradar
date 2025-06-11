/**
 * ProjectDetailTechnologies Component - Technology tags display
 */

'use client';

interface ProjectDetailTechnologiesProps {
  technologies: string[];
}

export default function ProjectDetailTechnologies({ technologies }: ProjectDetailTechnologiesProps) {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-900 mb-3">Technologies</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
