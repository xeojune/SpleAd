import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import SnsLinkPage from './pages/link/snsLinkPage'
import MediaPage from './pages/media/mediaPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/link" element={<SnsLinkPage />} />
          <Route path="/media" element={<MediaPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
