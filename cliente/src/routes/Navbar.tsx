import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();//validar que el usuario esta logueado

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CinesApp
        </Typography>

        {/* Menú hamburguesa solo en móvil */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {user && <MenuItem onClick={() => navigate('/cinemas')}>Cines</MenuItem>}
            {user && <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>}
            {!user && <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>}
          </Menu>
        </Box>

        {/* Botones normales solo en escritorio */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {user && (
            <Button color="inherit" onClick={() => navigate('/cinemas')}>
              Cines
            </Button>
          )}
          
          {/* Si hay sesión mostramos logout, si no login */}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
          {user?.role === 'ADMIN' && (
            <Button color=
            "inherit" onClick={() => navigate('/admin')}>
            Administración
            </Button>
    )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};