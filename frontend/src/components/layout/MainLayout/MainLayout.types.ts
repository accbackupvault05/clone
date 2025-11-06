import { ReactNode } from 'react';

export interface MainLayoutProps {
  children: ReactNode;
  showBottomNavigation?: boolean;
  showHeader?: boolean;
  className?: string;
}