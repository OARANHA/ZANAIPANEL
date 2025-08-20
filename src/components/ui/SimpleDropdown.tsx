'use client';

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface SimpleDropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  separator?: boolean;
}

interface SimpleDropdownProps {
  items: SimpleDropdownItem[];
  align?: 'left' | 'right';
}

export default function SimpleDropdown({ items, align = 'right' }: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: SimpleDropdownItem) => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('SimpleDropdown: Button clicked');
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 hover:text-gray-800 dark:text-gray-400 rounded flex items-center justify-center focus:outline-none"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9999]" 
            onClick={() => setIsOpen(false)}
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