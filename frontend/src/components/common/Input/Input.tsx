import React, { forwardRef } from 'react';
import { InputProps } from './Input.types';
import {
  InputContainer,
  Label,
  InputWrapper,
  StyledInput,
  IconWrapper,
  LoadingSpinner,
  HelperText,
  CharacterCount,
} from './Input.styles';

/**
 * Input component with multiple variants, icons, and validation states
 * Supports responsive design and accessibility features
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'medium',
      variant = 'default',
      fullWidth = false,
      leftIcon,
      rightIcon,
      loading = false,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon) || loading;
    
    const characterCount = maxLength && value ? String(value).length : 0;
    const showCharacterCount = maxLength && characterCount > maxLength * 0.8;

    return (
      <InputContainer $fullWidth={fullWidth}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        
        <InputWrapper>
          {leftIcon && (
            <IconWrapper $position="left">{leftIcon}</IconWrapper>
          )}
          
          <StyledInput
            ref={ref}
            id={inputId}
            $size={size}
            $variant={variant}
            $fullWidth={fullWidth}
            $hasError={hasError}
            $hasLeftIcon={hasLeftIcon}
            $hasRightIcon={hasRightIcon}
            value={value}
            maxLength={maxLength}
            aria-invalid={hasError}
            aria-describedby={
              error || helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {loading && <LoadingSpinner />}
          {rightIcon && !loading && (
            <IconWrapper $position="right">{rightIcon}</IconWrapper>
          )}
        </InputWrapper>
        
        {(error || helperText) && (
          <HelperText id={`${inputId}-helper`} $isError={hasError}>
            {error || helperText}
          </HelperText>
        )}
        
        {showCharacterCount && (
          <CharacterCount>
            {characterCount}/{maxLength}
          </CharacterCount>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input;