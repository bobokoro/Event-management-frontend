import { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Chip,
    CircularProgress,
    Fab,
    TextField,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { getAllEvents, getAllPublicEvents, searchEvents } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

const statuses = ['', 'DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'];

const EventsList = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [role]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = role === 'ORGANIZER'
                ? await getAllEvents()
                : await getAllPublicEvents();
            setEvents(data);
        } catch {
            console.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await searchEvents(keyword, status);
            setEvents(data);
        } catch {
            console.error('Failed to search events');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setKeyword('');
        setStatus('');
        await fetchEvents();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    {role === 'ORGANIZER' ? 'My Events' : 'Browse Events'}
                </Typography>
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    label="Search events"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ minWidth: 150 }}
                >
                    {statuses.map((s) => (
                        <MenuItem key={s} value={s}>
                            {s || 'All Statuses'}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
                <Button variant="outlined" onClick={handleClear}>
                    Clear
                </Button>
            </Box>

            {events.length === 0 ? (
                <Typography color="text.secondary">No events found.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6">{event.name}</Typography>
                                        <Chip label={event.status} size="small" color="primary" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mb={1}>
                                        {event.eventDesc}
                                    </Typography>
                                    <Typography variant="body2">
                                        📍 {event.venue}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/events/${event.id}`)}
                                    >
                                        View Details
                                    </Button>
                                    {role === 'ATTENDEE' && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => navigate(`/events/${event.id}/tickets`)}
                                        >
                                            Get Tickets
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {role === 'ORGANIZER' && (
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 24, right: 24 }}
                    onClick={() => navigate('/events/create')}
                >
                    <AddIcon />
                </Fab>
            )}
        </Container>
    );
};

export default EventsList;