import styled, { css } from 'styled-components';
import { form, sizes } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';
import { InputSize, InputVariant } from './Input.types';

interface StyledInputProps {
  $size: InputSize;
  $variant: InputVariant;
  $fullWidth: boolean;
  $hasError: boolean;
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
}

const getVariantStyles = ($variant: InputVariant) => {
  switch ($variant) {
    case 'filled':
      return css`
        background-color: ${({ theme }) => theme.colors.gray[100]};
        border: 1px solid transparent;
        
        &:focus {
          background-color: ${({ theme }) => theme.colors.white};
          border-color: ${({ theme }) => theme.colors.primary};
        }
      `;
    case 'outlined':
      return css`
        background-color: transparent;
        border: 2px solid ${({ theme }) => theme.colors.border};
        
        &:focus {
          border-color: ${({ theme }) => theme.colors.primary};
        }
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.colors.surface};
        border: 1px solid ${({ theme }) => theme.colors.border};
        
        &:focus {
          border-color: ${({ theme }) => theme.colors.primary};
        }
      `;
  }
};

const getSizeStyles = ($size: InputSize) => {
  switch ($size) {
    case 'small':
      return css`
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.fonts.sizes.sm};
        min-height: 36px;
      `;
    case 'large':
      return css`
        padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
        font-size: ${({ theme }) => theme.fonts.sizes.lg};
        min-height: 56px;
      `;
    default:
      return css`
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
        font-size: ${({ theme }) => theme.fonts.sizes.md};
        min-height: 44px;
      `;
  }
};

export const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

export const Label = styled.label`
  ${form.label}
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input<StyledInputProps>`
  ${form.input}
  ${({ $size }) => getSizeStyles($size)}
  ${({ $variant }) => getVariantStyles($variant)}
  
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  ${({ $hasLeftIcon, theme }) =>
    $hasLeftIcon &&
    css`
      padding-left: calc(${theme.spacing.xl} + 24px);
    `}
  
  ${({ $hasRightIcon, theme }) =>
    $hasRightIcon &&
    css`
      padding-right: calc(${theme.spacing.xl} + 24px);
    `}
  
  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.error};
      
      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 3px ${theme.colors.error}20;
      }
    `}
  
  /* Mobile-specific adjustments */
  @media ${device.mobile} {
    min-height: 44px; /* iOS minimum touch target */
    font-size: 16px; /* Prevent zoom on iOS */
  }
`;

export const IconWrapper = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  ${({ $position }) => ($position === 'left' ? 'left' : 'right')}: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const HelperText = styled.div<{ $isError: boolean }>`
  ${form.error}
  color: ${({ $isError, theme }) => ($isError ? theme.colors.error : theme.colors.textSecondary)};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
`;

export const CharacterCount = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;