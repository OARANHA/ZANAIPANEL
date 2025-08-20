'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DropdownMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
}

export default function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('DropdownMenu: Trigger clicked, current state:', isOpen);
    setIsOpen(!isOpen);
    console.log('DropdownMenu: New state will be:', !isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleTriggerClick}
        className="focus:outline-none"
        type="button"
      >
        {trigger}
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9999]" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          
          {/* Dropdown menu */}
          <div className={`absolute top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[10000] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}>
            <div className="py-1">
              {items.map((item, index) => {
                if (item.separator) {
                  return (
                    <div key={index} className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  );
                }
                
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    disabled={item.disabled}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors ${
                      item.disabled
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : `${item.color || 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}