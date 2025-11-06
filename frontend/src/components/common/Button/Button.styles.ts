import styled, { css } from 'styled-components';
import { button, sizes } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';
import { ButtonVariant, ButtonSize } from './Button.types';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $loading: boolean;
}

const getVariantStyles = ($variant: ButtonVariant) => {
  switch ($variant) {
    case 'primary':
      return button.primary;
    case 'secondary':
      return button.secondary;
    case 'ghost':
      return button.ghost;
    case 'danger':
      return button.danger;
    default:
      return button.primary;
  }
};

const getSizeStyles = ($size: ButtonSize) => {
  switch ($size) {
    case 'small':
      return sizes.small;
    case 'medium':
      return sizes.medium;
    case 'large':
      return sizes.large;
    default:
      return sizes.medium;
  }
};

export const StyledButton = styled.button<StyledButtonProps>`
  ${button.base}
  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}
  
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
  
  ${({ $loading }) =>
    $loading &&
    css`
      cursor: not-allowed;
      opacity: 0.7;
    `}
  
  /* Mobile-specific adjustments */
  @media ${device.mobile} {
    min-height: 44px; /* iOS minimum touch target */
  }
  
  /* Tablet adjustments */
  @media ${device.tablet} {
    ${({ $size }) =>
      $size === 'large' &&
      css`
        padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xxl};
        font-size: ${({ theme }) => theme.fonts.sizes.lg};
      `}
  }
`;

export const ButtonContent = styled.span<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  ${({ $loading }) =>
    $loading &&
    css`
      opacity: 0;
    `}
`;

export const LoadingSpinner = styled.div<{ $loading: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  display: ${({ $loading }) => ($loading ? 'block' : 'none')};
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1em;
    height: 1em;
  }
`;