import { Box, Typography } from '@mui/material';
import { Navbar } from './Navbar.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
        {children}
      </Box>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'primary.dark', color: 'white' }}>
        <Typography variant="body2">
        {new Date().getFullYear()} Cines - Universidad de Valladolid
        </Typography>
      </Box>
    </Box>
  );
};