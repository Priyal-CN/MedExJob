import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from './ui/badge';

interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick }) => {
  if (count === 0) return null;

  return (
    <div className="relative inline-block" onClick={onClick}>
      <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
      <Badge 
        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center animate-pulse"
      >
        {count > 99 ? '99+' : count}
      </Badge>
    </div>
  );
};




