import React, { ReactNode } from 'react';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <ShadcnTooltip>
        <TooltipTrigger asChild>
          <div className={className}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};