import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button,
  Collapse,
  Box,
  Chip,
  Divider,
  useTheme,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, AccessAlarm, Theaters, Place } from '@mui/icons-material';
import type { CinemaResponseDto } from "../../types/cines.types";
import { useAuth } from "../../context/AuthContext";
import { Edit } from '@mui/icons-material';
import { api } from "../../lib/api";

interface CineProps {
    cinema: CinemaResponseDto;
}

export const CineCard = ({ cinema }: CineProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const hasCatalog = cinema.catalog && cinema.catalog.length > 0;
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN';

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(cinema.name);
  const [editCapacity, setEditCapacity] = useState(cinema.capacity);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleSave = async () => {
    await api.put('/cinemas', { id: cinema.id, name: editName, capacity: editCapacity });
    setEditing(false);
  };

  const handleOpenPayment = (movieId: number | string) => {
    setSelectedMovieId(movieId);
    setOpenPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentForm.cardHolder || !paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv) {
    alert("Por favor, rellena todos los campos de la tarjeta.");
    return;
   }
    try {

      const payload = {
      movieId: Number(selectedMovieId),
      cinemaId: Number(cinema.id),
      cardHolder: paymentForm.cardHolder,
      cardNumber: paymentForm.cardNumber,
      expiryDate: paymentForm.expiryDate,
      cvv: paymentForm.cvv
    };

      await api.post('/tickets/buy', payload);
            alert("¡Pago completado! Ya tienes tu entrada.");
            setOpenPayment(false);

            setPaymentForm({ ...paymentForm, cardHolder: '', cardNumber: '', expiryDate: '', cvv: '' });
      
    } catch (error) {
      console.error('Error al comprar la entrada:', error);
      alert("Vaya, hubo un error procesando el pago. Inténtalo de nuevo.");
    }
  };

  return (
    <Card 
      elevation={3}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          height: 140, 
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        <Theaters sx={{ fontSize: 60, opacity: 0.8 }} />
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Typography gutterBottom color="primary.main" variant="h5" component="h2" fontWeight="bold">
          {cinema.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
          <Place fontSize="small" />
          <Typography variant="body2">
            Aforo: {cinema.capacity} personas
          </Typography>
        </Box>
      </CardContent>
      
      {editing && (
        <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre" size="small" value={editName} onChange={e => setEditName(e.target.value)} />
          <TextField label="Aforo" size="small" type="number" value={editCapacity} onChange={e => setEditCapacity(Number(e.target.value))} />
          <Button variant="contained" size="small" onClick={handleSave}>Guardar</Button>
        </Box>
      )}

      <Divider />
      
      <CardActions sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between'}}>
        {hasCatalog ? (
          <Button 
            size="small" 
            variant={expanded ? "contained" : "outlined"}
            color="primary"
            onClick={handleExpandClick}
            endIcon={<ExpandMoreIcon sx={{ 
              transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s'
            }} />}
            disableElevation
            sx={{ borderRadius: 2 }}
          >
            {expanded ? 'Ocultar Cartelera' : 'Ver Cartelera'}
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, ml: 1, fontStyle: 'italic' }}>
            Sin cartelera disponible
          </Typography>
        )}
      </CardActions>

        {canEdit && (
          <Button
            size="small" variant="outlined" color="warning"
            startIcon={<Edit />}
            sx={{ borderRadius: 2 }}
            onClick={() => setEditing(!editing)}
          >
            Editar
          </Button>
        )}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2, pt: 1, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
          {cinema.catalog?.map((movie) => (
            <Box key={movie.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'primary.main' }}>
                {movie.title}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.sessions.map((session, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    
                    <Chip
                      icon={<AccessAlarm sx={{ fontSize: '14px !important' }} />}
                      label={`${session.start} - ${session.end}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        borderColor: 'rgba(0,0,0,0.1)'
                      }}
                    />
                  
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="small"
                      onClick={() => handleOpenPayment(movie.id)}
                      disableElevation
                      sx={{ borderRadius: 1, fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                    >
                      Comprar
                    </Button>
                    
                  </Box>
                
                ))}
                {movie.sessions.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    No hay sesiones
                  </Typography>
                )}
              </Box>
              <Divider sx={{ mt: 1.5, opacity: 0.5 }} />
            </Box>
          ))}
        </Box>
      </Collapse>
      <Dialog open={openPayment} onClose={() => setOpenPayment(false)}>
        <DialogTitle>Finalizar Compra</DialogTitle>
        
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, minWidth: 350 }}>
            <Typography variant="body2" color="text.secondary">
                Introduce los datos de tu tarjeta...
            </Typography>
            
            <TextField 
                label="Nombre del titular"
                value={paymentForm.cardHolder}
                onChange={(e) => setPaymentForm({...paymentForm, cardHolder: e.target.value})}
            />

            <TextField 
                label="Número de tarjeta"
                slotProps={{ htmlInput: { maxLength: 16 } }}
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                    label="Fecha de caducidad" 
                    placeholder="MM/AA"
                    slotProps={{ htmlInput: { maxLength: 5 } }}   
                    value={paymentForm.expiryDate}
                    onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                    sx={{ width: '50%' }}
                />
                
                <TextField 
                    label="CVV" 
                    type="password"
                    slotProps={{ htmlInput: { maxLength: 3 } }}    
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                    sx={{ width: '50%' }}
                />
            </Box>

        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenPayment(false)}>Cancelar</Button>
          <Button onClick={handleConfirmPayment} variant="contained">
            Pagar 
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}