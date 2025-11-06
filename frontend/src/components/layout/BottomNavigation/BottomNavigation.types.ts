import { ReactNode } from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  path: string;
  badge?: number;
  disabled?: boolean;
}

export interface BottomNavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
}