import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard JP';
    src: url('/fonts/PretendardJP-Regular.woff2') format('woff2'),
         url('/fonts/PretendardJP-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard JP';
    src: url('/fonts/PretendardJP-Medium.woff2') format('woff2'),
         url('/fonts/PretendardJP-Medium.woff') format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard JP';
    src: url('/fonts/PretendardJP-Bold.woff2') format('woff2'),
         url('/fonts/PretendardJP-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pretendard JP', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export default GlobalStyles;
