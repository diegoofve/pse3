import { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { api } from './lib/api.ts';
// hay que importat la instancia de axios configurada

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; api?: string; success?: string }>({});
    const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    //email
    if (!email) newErrors.email = 'El email es obligatorio';
    else if (!email.includes('@')) newErrors.email = 'El email no es válido';
    
    //contraseña
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    
    //confirmación
    if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!validate()) return;

    setLoading(true); 
    setErrors({}); 

    try {
      const response = await api.post('/register', { email, password });
      
      setErrors({ success: response.data.message + ' Redirigiendo al login...' });
      
      setTimeout(() => {
          navigate('/login');
      }, 2000);

    } catch (error: any) {
      setErrors({ api: error.response?.data?.error || 'Error de conexión con el servidor' });
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
        Crear cuenta
      </Typography>

      {/* Alertas de Feedback visual [cite: 234-235] */}
      {errors.api && <Alert severity="error">{errors.api}</Alert>}
      {errors.success && <Alert severity="success">{errors.success}</Alert>}

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

      <TextField
        label="Confirmar Contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        fullWidth
        disabled={loading}
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="secondary"
        fullWidth 
        disabled={loading}
        sx={{ mt: 2, height: 48 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
      </Button>
      
      <Button 
        variant="text" 
        onClick={() => navigate('/login')}
        disabled={loading}
        sx={{ mt: 1 }}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </Box>
  );
};