import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Bem-vindo ao seu painel de controle
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleLogout}
                    sx={{ mt: 2 }}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;