import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
    Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Forgot Password
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" mb={3}>
                        Enter your email and we'll send you a reset link
                    </Typography>

                    {success ? (
                        <Alert severity="success">
                            If your email is registered you will receive a reset link shortly.
                            Check your inbox!
                        </Alert>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            <Typography align="center">
                                Remember your password?{' '}
                                <Link to="/login">Sign in here</Link>
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default ForgotPassword;