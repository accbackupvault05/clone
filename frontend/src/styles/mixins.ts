import { css } from 'styled-components';
import { theme } from './theme';
import { device } from './breakpoints';

// Typography mixins
export const typography = {
  heading1: css`
    font-size: ${theme.fonts.sizes.xxxl};
    font-weight: ${theme.fonts.weights.bold};
    line-height: ${theme.fonts.lineHeights.tight};
    
    @media ${device.tablet} {
      font-size: 2.5rem;
    }
    
    @media ${device.desktop} {
      font-size: 3rem;
    }
  `,
  
  heading2: css`
    font-size: ${theme.fonts.sizes.xxl};
    font-weight: ${theme.fonts.weights.semibold};
    line-height: ${theme.fonts.lineHeights.tight};
    
    @media ${device.tablet} {
      font-size: 2rem;
    }
  `,
  
  heading3: css`
    font-size: ${theme.fonts.sizes.xl};
    font-weight: ${theme.fonts.weights.semibold};
    line-height: ${theme.fonts.lineHeights.normal};
  `,
  
  body: css`
    font-size: ${theme.fonts.sizes.md};
    font-weight: ${theme.fonts.weights.normal};
    line-height: ${theme.fonts.lineHeights.normal};
  `,
  
  caption: css`
    font-size: ${theme.fonts.sizes.sm};
    font-weight: ${theme.fonts.weights.normal};
    line-height: ${theme.fonts.lineHeights.normal};
    color: ${theme.colors.textSecondary};
  `,
  
  small: css`
    font-size: ${theme.fonts.sizes.xs};
    font-weight: ${theme.fonts.weights.normal};
    line-height: ${theme.fonts.lineHeights.normal};
  `,
};

// Button mixins
export const button = {
  base: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: ${theme.borderRadius.lg};
    font-family: ${theme.fonts.primary};
    font-weight: ${theme.fonts.weights.semibold};
    cursor: pointer;
    transition: all ${theme.transitions.fast};
    text-decoration: none;
    outline: none;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &:focus-visible {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
  `,
  
  primary: css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.black};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary};
      opacity: 0.9;
      transform: translateY(-1px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  
  secondary: css`
    background-color: ${theme.colors.surface};
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray[800]};
    }
  `,
  
  ghost: css`
    background-color: transparent;
    color: ${theme.colors.text};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.surface};
    }
  `,
  
  danger: css`
    background-color: ${theme.colors.error};
    color: ${theme.colors.white};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.error};
      opacity: 0.9;
    }
  `,
};

// Size mixins for buttons and inputs
export const sizes = {
  small: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fonts.sizes.sm};
    min-height: 32px;
  `,
  
  medium: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fonts.sizes.md};
    min-height: 40px;
  `,
  
  large: css`
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    font-size: ${theme.fonts.sizes.lg};
    min-height: 48px;
    
    @media ${device.tablet} {
      min-height: 56px;
    }
  `,
};

// Layout mixins
export const layout = {
  flexCenter: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  
  flexBetween: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  
  flexColumn: css`
    display: flex;
    flex-direction: column;
  `,
  
  absoluteCenter: css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
  
  fullScreen: css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
  `,
  
  container: css`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.md};
    
    @media ${device.tablet} {
      padding: 0 ${theme.spacing.lg};
    }
    
    @media ${device.desktop} {
      padding: 0 ${theme.spacing.xl};
    }
  `,
};

// Animation mixins
export const animations = {
  fadeIn: css`
    animation: fadeIn 0.3s ease-in-out;
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  
  slideUp: css`
    animation: slideUp 0.3s ease-out;
    
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  
  slideDown: css`
    animation: slideDown 0.3s ease-out;
    
    @keyframes slideDown {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  
  scaleIn: css`
    animation: scaleIn 0.2s ease-out;
    
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  
  pulse: css`
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  `,
};

// Form mixins
export const form = {
  input: css`
    width: 100%;
    padding: ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.surface};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fonts.sizes.md};
    transition: all ${theme.transitions.fast};
    
    &::placeholder {
      color: ${theme.colors.textSecondary};
    }
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}20;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  
  label: css`
    display: block;
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.fonts.sizes.sm};
    font-weight: ${theme.fonts.weights.medium};
    color: ${theme.colors.text};
  `,
  
  error: css`
    color: ${theme.colors.error};
    font-size: ${theme.fonts.sizes.xs};
    margin-top: ${theme.spacing.xs};
  `,
};

// Card mixins
export const card = {
  base: css`
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border};
    overflow: hidden;
  `,
  
  elevated: css`
    box-shadow: ${theme.shadows.md};
  `,
  
  interactive: css`
    cursor: pointer;
    transition: all ${theme.transitions.fast};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  `,
};

// Scrollbar mixins
export const scrollbar = {
  hidden: css`
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  
  styled: css`
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.border} transparent;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: ${theme.colors.border};
      border-radius: ${theme.borderRadius.full};
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background-color: ${theme.colors.textSecondary};
    }
  `,
};

// Truncate text mixin
export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Line clamp mixin
export const lineClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Aspect ratio mixin
export const aspectRatio = (ratio: string) => css`
  aspect-ratio: ${ratio};
  
  @supports not (aspect-ratio: ${ratio}) {
    &::before {
      content: '';
      display: block;
      padding-top: ${ratio === '1/1' ? '100%' : ratio === '16/9' ? '56.25%' : ratio === '4/3' ? '75%' : '100%'};
    }
  }
`;