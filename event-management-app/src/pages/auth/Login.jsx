import { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import { Divider } from '@mui/material';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import {useNavigate,  Link} from 'react-router-dom';
import {login} from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const {loginUser} = useAuth();
    const [formData, setFormData] = useState({email:'', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleChange =(e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit =async (e) => {
      e.preventDefault();
      setLoading();
      setError('');
      try {
        const data = await login(formData);
        loginUser(data.token);
        navigate('/events');
       }catch (err){
        console.error(err);
        setError(err.message || 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Container maxWidth ="sm">
        <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" mb={3}>
                        Sign in to your account
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Divider sx={{ my: 2 }}>OR</Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<GoogleIcon />}
                            onClick={() => window.location.href = 'http://localhost:8081/oauth2/authorization/google'}
                            sx={{ mb: 2 }}
                        >
                            Continue with Google
                        </Button>

                        
                        <Typography align="center">
                            Don't have an account?{' '}
                            <Link to="/register">Register here</Link>
                        </Typography>
                        <Typography align="center" sx={{ mt: 1 }}>
                            <Link to="/forgot-password">Forgot your password?</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
      </Container>
    );
    };
    export default Login;