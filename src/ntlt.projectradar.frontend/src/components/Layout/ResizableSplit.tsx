/**
 * ResizableSplit Component - Resizable split view with draggable divider
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ResizableSplitProps {
  children: [React.ReactNode, React.ReactNode];
  initialLeftWidth?: number; // Percentage (0-100) or Pixels (when useFixedWidth=true)
  minLeftWidth?: number; // Percentage or Pixels
  maxLeftWidth?: number; // Percentage or Pixels  
  className?: string;
  orientation?: 'horizontal' | 'vertical'; // For future extensibility
  useFixedWidth?: boolean; // If true, use pixel values instead of percentages
}

export default function ResizableSplit({
  children,
  initialLeftWidth = 33,
  minLeftWidth = 20,
  maxLeftWidth = 60,
  className = '',
  orientation = 'horizontal',
  useFixedWidth = false
}: ResizableSplitProps) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Handle mouse down on divider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = leftWidth;
    
    // Add cursor style to body
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [leftWidth]);
  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - startXRef.current;
    
    let newWidth: number;
    if (useFixedWidth) {
      // Fixed width mode - use pixels
      newWidth = Math.min(
        maxLeftWidth,
        Math.max(minLeftWidth, startWidthRef.current + deltaX)
      );
    } else {
      // Percentage mode - use percentage
      const deltaPercent = (deltaX / containerRect.width) * 100;
      newWidth = Math.min(
        maxLeftWidth,
        Math.max(minLeftWidth, startWidthRef.current + deltaPercent)
      );
    }

    setLeftWidth(newWidth);
  }, [isDragging, minLeftWidth, maxLeftWidth, useFixedWidth]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  const rightWidth = useFixedWidth ? 'auto' : `${100 - leftWidth}%`;
  const leftWidthStyle = useFixedWidth ? `${leftWidth}px` : `${leftWidth}%`;

  return (
    <div ref={containerRef} className={`flex h-screen ${className}`}>
      {/* Left Panel */}
      <div 
        className="flex flex-col flex-shrink-0" 
        style={{ width: leftWidthStyle }}
      >
        {children[0]}
      </div>

      {/* Resizable Divider */}
      <div 
        className={`
          relative bg-neutral-200 hover:bg-neutral-300 transition-colors cursor-col-resize select-none flex-shrink-0
          ${isDragging ? 'bg-blue-300' : ''}
          ${orientation === 'horizontal' ? 'w-1' : 'h-1'}
        `}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`
            bg-neutral-400 rounded-full
            ${orientation === 'horizontal' ? 'w-0.5 h-8' : 'w-8 h-0.5'}
            ${isDragging ? 'bg-blue-500' : ''}
          `} />
        </div>

        {/* Hover area for better UX */}
        <div className={`
          absolute inset-0 
          ${orientation === 'horizontal' ? '-left-1 -right-1' : '-top-1 -bottom-1'}
        `} />
      </div>

      {/* Right Panel */}
      <div 
        className="flex flex-col flex-1" 
        style={useFixedWidth ? {} : { width: rightWidth }}
      >
        {children[1]}
      </div>
    </div>
  );
}
