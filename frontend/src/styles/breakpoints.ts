import { theme } from './theme';

// Device breakpoints for media queries (mobile-first approach)
export const device = {
  mobile: `(min-width: ${theme.breakpoints.mobile})`,
  tablet: `(min-width: ${theme.breakpoints.tablet})`,
  desktop: `(min-width: ${theme.breakpoints.desktop})`,
  largeDesktop: `(min-width: ${theme.breakpoints.largeDesktop})`,
};

// Utility functions for responsive design
export const mediaQuery = {
  mobile: (styles: string) => `
    @media ${device.mobile} {
      ${styles}
    }
  `,
  tablet: (styles: string) => `
    @media ${device.tablet} {
      ${styles}
    }
  `,
  desktop: (styles: string) => `
    @media ${device.desktop} {
      ${styles}
    }
  `,
  largeDesktop: (styles: string) => `
    @media ${device.largeDesktop} {
      ${styles}
    }
  `,
};

// Container max-widths for different breakpoints
export const containerMaxWidth = {
  mobile: '100%',
  tablet: '768px',
  desktop: '1024px',
  largeDesktop: '1200px',
};

// Grid system utilities
export const gridColumns = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  largeDesktop: 4,
};

// Common responsive patterns
export const responsivePatterns = {
  // Full width on mobile, centered with max-width on larger screens
  container: `
    width: 100%;
    margin: 0 auto;
    padding: 0 ${theme.spacing.md};
    
    @media ${device.tablet} {
      max-width: ${containerMaxWidth.tablet};
      padding: 0 ${theme.spacing.lg};
    }
    
    @media ${device.desktop} {
      max-width: ${containerMaxWidth.desktop};
      padding: 0 ${theme.spacing.xl};
    }
    
    @media ${device.largeDesktop} {
      max-width: ${containerMaxWidth.largeDesktop};
    }
  `,
  
  // Responsive grid
  grid: `
    display: grid;
    gap: ${theme.spacing.md};
    grid-template-columns: repeat(${gridColumns.mobile}, 1fr);
    
    @media ${device.tablet} {
      grid-template-columns: repeat(${gridColumns.tablet}, 1fr);
      gap: ${theme.spacing.lg};
    }
    
    @media ${device.desktop} {
      grid-template-columns: repeat(${gridColumns.desktop}, 1fr);
    }
    
    @media ${device.largeDesktop} {
      grid-template-columns: repeat(${gridColumns.largeDesktop}, 1fr);
    }
  `,
  
  // Responsive flex
  flexCenter: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  
  flexBetween: `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  
  // Hide/show at different breakpoints
  hideOnMobile: `
    display: none;
    
    @media ${device.tablet} {
      display: block;
    }
  `,
  
  showOnMobileOnly: `
    display: block;
    
    @media ${device.tablet} {
      display: none;
    }
  `,
};