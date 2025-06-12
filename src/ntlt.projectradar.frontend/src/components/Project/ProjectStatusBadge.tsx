'use client';

import React from 'react';
import { ProjectStatus } from '../../types/project';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (s: ProjectStatus): string => {
    switch (s) {
      case ProjectStatus.New:
        return 'bg-blue-500 text-white border-blue-500';
      case ProjectStatus.InterestingCold:
        return 'bg-sky-500 text-white border-sky-500'; // Hellblau
      case ProjectStatus.InterestingContacted:
        return 'bg-yellow-500 text-black border-yellow-500';
      case ProjectStatus.InterestingInProgress:
        return 'bg-orange-500 text-white border-orange-500';
      case ProjectStatus.Won:
        return 'bg-green-500 text-white border-green-500';
      case ProjectStatus.Lost:
        return 'bg-red-500 text-white border-red-500';
      case ProjectStatus.NotInteresting:
        return 'bg-gray-500 text-white border-gray-500';
      case ProjectStatus.MissedOpportunity:
        return 'bg-gray-500 text-white border-gray-500';
      default:
        return 'bg-gray-300 text-black border-gray-300';
    }
  };

  const getStatusText = (s: ProjectStatus): string => {
    switch (s) {
      case ProjectStatus.New:
        return 'Neu';
      case ProjectStatus.InterestingCold:
        return 'Kaltakquise';
      case ProjectStatus.InterestingContacted:
        return 'Kontaktiert';
      case ProjectStatus.InterestingInProgress:
        return 'In Bearbeitung';
      case ProjectStatus.Won:
        return 'Gewonnen';
      case ProjectStatus.Lost:
        return 'Verloren';
      case ProjectStatus.NotInteresting:
        return 'Nicht Interessant';
      case ProjectStatus.MissedOpportunity:
        return 'Verpasst';
      default:
        return s; // Fallback to the original enum value if unknown
    }
  }

  return (
    <span
      className={`px-2 py-1 text-[0.6rem] font-semibold rounded-full inline-block ${getStatusColor(status)}`}
    >
      {getStatusText(status)}
    </span>
  );
};

export default ProjectStatusBadge;
