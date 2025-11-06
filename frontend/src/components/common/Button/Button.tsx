import React from 'react';
import { ButtonProps } from './Button.types';
import {
  StyledButton,
  ButtonContent,
  LoadingSpinner,
  IconWrapper,
} from './Button.styles';

/**
 * Button component with multiple variants and responsive design
 * Supports loading states, icons, and full accessibility
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      <LoadingSpinner $loading={loading} />
      <ButtonContent $loading={loading}>
        {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
        {children}
        {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
      </ButtonContent>
    </StyledButton>
  );
};

export default Button;