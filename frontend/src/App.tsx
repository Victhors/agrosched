import React, { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  CssBaseline,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthContext } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from './components/Layout/Dashboard';
function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao realizar login');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="h-screen flex items-center justify-center">
      <CssBaseline />
      <Paper 
        elevation={3} 
        className="p-8 w-full max-w-md"
        sx={{
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'secondary.main',
              width: 56,
              height: 56,
              boxShadow: 2,
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          
          <Typography 
            component="h1" 
            variant="h4" 
            className="font-bold text-gray-800"
            sx={{ mb: 3 }}
          >
            Login
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            className="w-full"
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox 
                  value="remember" 
                  color="primary"
                  sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                />
              }
              label="Lembrar-me"
              sx={{ mt: 2 }}
            />

            {error && (
              <Typography 
                color="error" 
                variant="body2" 
                className="mt-2 text-center"
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 3,
                },
              }}
            >
              Entrar
            </Button>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Link
                  href="#"
                  variant="body2"
                  className="text-primary hover:text-primary-dark"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} className="text-right">
                <Link
                  href="/register"
                  variant="body2"
                  className="text-primary hover:text-primary-dark"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Criar conta
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;