"use client";
import React, { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";

interface CollapseProps {
  title: string | ReactNode;      // Can be string or JSX
  defaultOpen?: boolean;          // Start open or closed
  children: ReactNode;            // Content inside collapse
  className?: string;             // Optional extra styling
  index?: number;                 // Optional index for numbering
}

export default function Collapse({
  title,
  children,
  defaultOpen = false,
  className = "",
  index,
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`group border-x border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
        {index !== undefined && (
          <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600">
            <GripVertical className="w-4 h-4 cursor-grab" />
            <span className="text-sm font-medium">{index + 1}</span>
          </div>
        )}

        <div className="flex items-center gap-2 flex-1" onClick={() => setIsOpen(!isOpen)}>
          <button className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="w-4 h-4 text-gray-700 transition-transform duration-200" /> : <ChevronRight className="w-4 h-4 text-gray-700 transition-transform duration-200" />}
          </button>
          {title}
        </div>
      </div>

      {/* Collapsible Content */}
      <div 
        className={`bg-gray-50 border-t border-gray-200 transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
