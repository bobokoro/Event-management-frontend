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
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 8 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Alert severity="error">
                            Invalid reset link. Please request a new password reset.
                        </Alert>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link to="/forgot-password">Request new reset link</Link>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" mb={3}>
                        Enter your new password below
                    </Typography>

                    {success ? (
                        <Alert severity="success">
                            Password reset successfully! Redirecting to login in 3 seconds...
                        </Alert>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <TextField
                                fullWidth
                                label="New Password"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default ResetPassword;