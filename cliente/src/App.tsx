import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { AppRegistration, Login } from '@mui/icons-material';
import heroImg from './assets/hero.png';
import './App.css';

function App() {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: 'background.default', 
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h2" 
              component="h1" 
              color="primary.main" 
              fontWeight="900" 
              gutterBottom
            >
              Bienvenido a CinesApp
            </Typography>
            
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.6 }}>
              Tu plataforma definitiva para descubrir las mejores películas, consultar las carteleras actualizadas y no perderte ni un solo estreno en tus cines favoritos.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <Button 
                variant="contained" 
                size="large" 
                color="primary"
                startIcon={<AppRegistration />}
                onClick={() => navigate('/register')}
                disableElevation
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold' }}
              >
                Registrarse
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                color="primary"
                startIcon={<Login />}
                onClick={() => navigate('/login')}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold' }}
              >
                Iniciar Sesión
              </Button>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Box 
              component="img"
              src={heroImg}
              alt="Gente en el cine o cartelera"
              sx={{ 
                width: '100%', 
                maxWidth: 500, 
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0px 20px 40px rgba(0,0,0,0.1)',
                transform: 'rotate(2deg)'
              }}
            />
          </Box>
          
        </Box>
      </Container>
    </Box>
  );
}

export default App;