import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loginUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            loginUser(token);
            navigate('/events');
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, gap: 2 }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary">
                Signing you in with Google...
            </Typography>
        </Box>
    );
};

export default OAuth2Callback;