import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.tsx'
import {Login} from './login.tsx'
import { CinesList } from './routes/cines/CinesList.tsx'
import { Register } from './register.tsx'
import { AuthProvider } from './context/AuthContext'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1', 
      light: '#9062e5',
      dark: '#280680',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7b1fa2',
      light: '#ae52d4',
      dark: '#4a0072',
      contrastText: '#fff',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
            <Route path="/cines" element={<CinesList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
