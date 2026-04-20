import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { api } from './lib/api.ts';



export const Login = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email?: string; password?: string; api?: string }>({});

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const {login} = useAuth();

    const validate = () => {
        const newErrors: typeof errors = {};
        if(!email) newErrors.email = 'El email es obligatorio';
        if(!email.includes('@')) newErrors.email = 'El email es invalido';
        if(!password) newErrors.password = 'La contraseña es obligatoria';
        if(password.length < 6) newErrors.password = 'Mínimo';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


  const handleSubmit = async (e: React.FormEvent) => { //porque react formevent no va macho
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/login', { email, password });
      
      login(response.data.token);
      
      navigate('/cines');
    } catch (error: any) {
      setErrors({ api: error.response?.data?.message || 'Error al iniciar sesión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        maxWidth: 400, 
        mx: 'auto', 
        mt: 8,
        p: 3,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Iniciar sesión
      </Typography>

      
      {errors.api && <Alert severity="error">{errors.api}</Alert>}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        disabled={loading}
      />

      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        disabled={loading}
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth 
        disabled={loading}
        sx={{ mt: 2, height: 48 }}
      >
        
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
      </Button>
    </Box>
  );
};
