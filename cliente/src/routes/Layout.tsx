import { Box, Typography } from '@mui/material';
import { Navbar } from './Navbar.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* La barra de navegación siempre arriba */}
      <Navbar />
      
      {/* El contenido principal de la página (CinesList, etc.) */}
      {/* El pt: 10 es para que el contenido no quede oculto detrás de la Navbar fija */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
        {children}
      </Box>

      {/* El footer estático que pide el laboratorio */}
      <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'primary.dark', color: 'white' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} CinesApp - Universidad de Valladolid
        </Typography>
      </Box>
    </Box>
  );
};