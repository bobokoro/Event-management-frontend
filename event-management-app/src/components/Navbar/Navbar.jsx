import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { token, logoutUser, role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                >
                    Korvesta Event Manager
                </Typography>
                <Box>
                    {token ? (
                        <>
                            <Button color="inherit" component={Link} to="/events">
                                Events
                            </Button>

                            {role === 'ATTENDEE' && (
                                <Button color="inherit" component={Link} to="/my-tickets">
                                    My Tickets
                                </Button>
                            )}

                            {role === 'STAFF' && (
                                <Button color="inherit" component={Link} to="/validate">
                                    Validate Tickets
                                </Button>
                            )}

                            <Button color="inherit" onClick={handleLogout}>
                                    Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}

                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;