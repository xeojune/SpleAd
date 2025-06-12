import type { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      text: string;
      textSecondary: string;
      primary: string;
      background: string;
      white: string;
    };
  }
}

export const theme: DefaultTheme = {
  colors: {
    text: '#1a1a1a',
    textSecondary: '#666666',
    primary: '#405DE6', // Instagram blue
    background: '#f5f5f5',
    white: '#ffffff',
  },
};
