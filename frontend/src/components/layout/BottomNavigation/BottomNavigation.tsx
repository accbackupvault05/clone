import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigationProps } from './BottomNavigation.types';
import {
  NavigationContainer,
  NavigationList,
  NavigationItem,
  NavigationButton,
  CameraButton,
  IconWrapper,
  Label,
  Badge,
} from './BottomNavigation.styles';

/**
 * BottomNavigation component for mobile navigation
 * Features responsive design and accessibility support
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  activeItem,
  onItemClick,
  className,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item: any) => {
    if (item.disabled) return;
    
    if (onItemClick) {
      onItemClick(item);
    } else {
      navigate(item.path);
    }
  };

  const isItemActive = (item: any) => {
    if (activeItem) {
      return activeItem === item.id;
    }
    return location.pathname === item.path;
  };

  return (
    <NavigationContainer className={className}>
      <NavigationList>
        {items.map((item) => {
          const isActive = isItemActive(item);
          const isCameraButton = item.id === 'camera';
          
          return (
            <NavigationItem
              key={item.id}
              $isActive={isActive}
              $disabled={item.disabled || false}
            >
              {isCameraButton ? (
                <CameraButton
                  $isActive={isActive}
                  onClick={() => handleItemClick(item)}
                  aria-label={item.label}
                  disabled={item.disabled}
                >
                  <IconWrapper>
                    {isActive && item.activeIcon ? item.activeIcon : item.icon}
                    {item.badge && item.badge > 0 && (
                      <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>
                    )}
                  </IconWrapper>
                </CameraButton>
              ) : (
                <NavigationButton
                  $isActive={isActive}
                  onClick={() => handleItemClick(item)}
                  aria-label={item.label}
                  disabled={item.disabled}
                >
                  <IconWrapper>
                    {isActive && item.activeIcon ? item.activeIcon : item.icon}
                    {item.badge && item.badge > 0 && (
                      <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>
                    )}
                  </IconWrapper>
                  <Label>{item.label}</Label>
                </NavigationButton>
              )}
            </NavigationItem>
          );
        })}
      </NavigationList>
    </NavigationContainer>
  );
};

export default BottomNavigation;